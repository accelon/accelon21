import {getContext} from 'svelte'
import {writable,get} from 'svelte/store'
import {parsePointer ,serializePointer} from 'pitaka/offtext';
import {getUserNotes} from './usernotes.js'
import {getUserData,setUserData} from './userdata.js';
import {PATHSEP } from 'pitaka';

export const addresses_a=writable([]);
export const addresses_b=writable([]);

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
    const out={items,backlinks,ptk,loc,mulu,y0,criteria,usernotes,dy};
    store.set(out)
}

export const setDy=(addresses=addresses_b,newdy=0)=>{
    const oldaddr=get(addresses)[0];
    let {basket,hook,loc,dy}=parsePointer(oldaddr);
    const addr=serializePointer(basket, loc, hook, newdy);
    if (newdy!==dy) {
        const addrs=get(addresses);
        addrs[0]=addr;
        // addresses.set(addrs); will trigger pitakaviewer refresh
    }
}
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