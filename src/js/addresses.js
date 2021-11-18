import {getContext} from 'svelte'
import {writable,get} from 'svelte/store'
import {parsePointer ,serializePointer} from 'pitaka/offtext';
import {getUserNotes} from './usernotes.js'
import {getBookmarks} from './bookmarks.js'
import {getUserData,setUserData} from './userdata.js';
import {PATHSEP,ADDRSEP } from 'pitaka';

export const addresses_a=writable([]);
export const addresses_b=writable([]);
export const activeline_a=writable(0);
export const activeline_b=writable(0);

export const userdata=writable({});
export const selectorShown=writable(false);
export const setLoc=async ({ptk,loc,y0,hook='',dy},store)=>{
    const old=get(store);
    if (!ptk) ptk=get(store).ptk;

    if (get(store).loc==loc && get(store).ptk===ptk) {
        return; //nothing to do
    }

    const activelinestore=getActivelineStore(store);
    activelinestore.set(dy||0);

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


    const out=Object.assign(old,{items,backlinks,ptk,loc,mulu,y0,criteria,usernotes,bookmarks,dy});
    store.set(out)
}
const packAddresses=arr=>{
    let prevbasket='';
    const out=[];
    for (let i=0;i<arr.length;i++) {
        const {basket}=parsePointer(arr[i]);
        
        if (prevbasket===basket) {
            out.push(arr[i].substr(PATHSEP.length+basket.length+PATHSEP.length))
        } else out.push(arr[i]); 
        if (basket) prevbasket=basket;
    }
    if (out.length==1 && out[0]==PATHSEP) return '';
    return out.join(ADDRSEP);
}
export const updateUrl=()=>{
    const a=packAddresses(get(addresses_a));
    const b=packAddresses(get(addresses_b));
    window.location.hash='#'+a + (b?('#'+b):'');
}
export const setLocAttrs=(addresses=addresses_b,_attrs)=>{
    const addrs=get(addresses);
    const {basket,loc,dy,attrs}=parsePointer(addrs[0]);
    const newattrs= Object.assign(attrs,_attrs);
    for (let key in newattrs) {
        if (!newattrs[key]&&typeof newattrs[key]!=='number') delete newattrs[key];
    }
    const newptr=serializePointer(basket,loc,'',dy,newattrs);
    addrs[0]=newptr;
    //addresses.set(addrs)
    updateUrl();
}
export const setActiveline=(addresses=addresses_b,newy=0,y0=0)=>{
    const addrs=get(addresses);
    const {basket,loc,dy,attrs}=parsePointer(addrs[0]);
    const newdy=newy-y0;
    if (newdy>=0&&newdy!==dy) {
        const newptr=serializePointer(basket,loc,'',newdy,attrs);
        addrs[0]=newptr;
        // addresses.set(addrs); //this will trigger redraw
        updateUrl();
    }
    if (addresses==addresses_a) {
        activeline_a.set( newy);
    } else {
        activeline_b.set( newy);
    }
}
export const getActivelineStore=(addresses=addresses_b)=>addresses==addresses_a?activeline_a:activeline_b;

export const settab=(addresses,newloc,{newtab=false}={})=>{
    const oldaddr=get(addresses)[0];
    let {basket,hook,attrs}=parsePointer(oldaddr);
    let newbasket=basket;
    if (typeof newloc!=='string' && newloc.loc!==PATHSEP) {
        if (typeof newloc.loc=='string') newloc=newloc.loc;
        if (typeof newloc.basket=='string') newbasket=newloc.basket;
    } else {
        if (newloc.loc) newloc=newloc.loc;
    }
    const addr=serializePointer(newbasket, newloc, hook,'',attrs);

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