import {getContext} from 'svelte'
import {writable,get} from 'svelte/store'
import {parsePointer ,serializePointer} from 'pitaka/offtext';
import {getUserNotes} from './usernotes.js'
import {getBookmarks} from './bookmarks.js'
import {getUserData,setUserData} from './userdata.js';
import {PATHSEP } from 'pitaka';

export const addresses_a=writable([]);
export const addresses_b=writable([]);
export const activeline_a=writable(0);
export const activeline_b=writable(1);

export const userdata=writable({});
export const selectorShown=writable(false);
export const setLoc=async ({ptk,loc,y0,hook='',dy=0},store)=>{
    if (!ptk) ptk=get(store).ptk;

    if (get(store).dy!==dy) {
        const old=get(store);
        // store.set({...old, dy});
    }
    if (get(store).loc==loc && get(store).ptk===ptk) {
        return; //nothing to do
    }
    const items=ptk.fetchPage(loc);
    const criteria=get(store).criteria||{};
    
    y0=y0|| (items.length&&items[0].key)||0;
    
    await ptk.prefetchLines(y0,y0+items.length);
    
    let mulu=[];
    if (items.length && !items[0].ptr) { //no mulu for toc page
        mulu=ptk.getMulu(y0,y0+items.length);
    }

    const usernotes=writable(getUserNotes(ptk,loc));
    const bookmarks=writable(getBookmarks(ptk,loc));
    const backlinks=ptk.getBacklinks(loc);

    const keyeditem={};
    items.forEach(it=>keyeditem[it.key]=it);

    for (let ptkname in backlinks) {
        for (let key in backlinks[ptkname]) {
            if (keyeditem[key]) keyeditem[key].backlinks=backlinks[ptkname][key];
        }
    }

    items.push({text:'　',key:'end'});//workaround

    // const userdata=getUserData(vstate.name,vstate.loc)
    const out={items,backlinks,ptk,loc,mulu,y0,criteria,usernotes,bookmarks,dy};
    store.set(out)
}

export const setActiveline=(addresses=addresses_b,newy=0)=>{
    if (addresses==addresses_a) {
        activeline_a.set( newy);
    } else {
        activeline_b.set( newy);
    } 
}
export const getActivelineStore=(addresses=addresses_b)=>addresses==addresses_a?activeline_a:activeline_b;

export const settab=(addresses,addr,{newtab=false}={})=>{
    if (typeof addr!=='string' && addr.loc!==PATHSEP) {
        const oldaddr=get(addresses)[0];
        let {basket,hook,loc}=parsePointer(oldaddr);

        if (typeof addr.loc=='string') loc=addr.loc;
        if (typeof addr.basket=='string') basket=addr.basket;
        addr=serializePointer(basket, loc, hook);
    } else {
        if (addr.loc) addr=addr.loc;
    }
    const addrs=get(addresses);
    if (newtab) {
        addrs.unshift(addr);
    } else {
        addrs[0]=addr;
    }
    addresses.set(addrs);
}

export const getside=()=>{
    return (getContext('addresses')==addresses_a)?'a':'b';
}

export const getActiveline=(addresses=addresses_b)=>{
    const ptr=parsePointer(get(addresses)[0]);
    return ptr.dy + ptr.y;
}
export const closetab=addresses=>{
    const addrs=get(addresses);
    if (addrs.length) addrs.shift();
    if (!addrs.length) {
        selectorShown.set(false); //frontpage cannot show tabselector
        addrs.push(PATHSEP);
    }
    addresses.set(addrs);
}
export const getOppositeAddresses=addresses=>addresses_b==addresses?addresses_a:addresses_b;