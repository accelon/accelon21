import {getContext} from 'svelte'
import {writable,get} from 'svelte/store'
import { parsePointer ,serializePointer} from 'pitaka/offtext';
import { copyAddress ,getCursorAddress} from './address.js';
import {updateSettings,settings} from './savestore.js'
import {getUserData,setUserData} from './userdata.js';
export const addresses_a=writable(accelon21_configuration.addresses_a||['/']);
export const addresses_b=writable(accelon21_configuration.addresses_b||['/']);

export const ntab_a=writable(0);
export const ntab_b=writable(0);
export const userdata=writable({});
export const vstate=writable(settings.vstate||{});
export const selectorShown=writable(false);
export const setLoc=async ({ptk,loc,y0,hook=''},store)=>{
    if (!ptk) ptk=get(store).ptk;
    const items=ptk.fetchPage(loc);
    
    y0=y0|| (items.length&&items[0].key)||0;
    
    await ptk.prefetchLines(y0,y0+items.length);
    vstate.set(Object.assign(get(vstate),{name:ptk.name,loc,hook,y0}))    
    
    let mulu=[];
    if (items.length && !items[0].ptr) { //no mulu for toc page
        mulu=ptk.getMulu(y0,y0+items.length);
    }

    //get foriegn links
    const backlinks=ptk.getBacklinks(loc);
    items.forEach(item=>{
        for (let ptkname in backlinks) {
            if (backlinks[ptkname][item.key]) {
                item.backlinks=backlinks[ptkname][item.key];
            }
        }
    })
    items.push({text:'---',key:'end'});//workaround

    const userdata=getUserData(vstate.name,vstate.loc);

    
    if (store) {
        store.set( {items,userdata,backlinks,ptk,loc,mulu,y0})
    } else {
        return {items,backlinks,userdata,loc,mulu,y0};
    }
}

export const gotab=(n,addresses=addresses_b)=>{
    const addrs=get(addresses);
    if (n<0) return;
    for (let i=0;i<n+1;i++) {
        if (!addrs[i]) addrs[i]='/';
    } 
    addresses.set(addrs);
    if (addresses===addresses_a) ntab_a.set(n)
    else ntab_b.set(n);
}

export const settab=(addr,{addresses=addresses_b,newtab=false}={})=>{
    const ntab=addresses===addresses_a?ntab_a:ntab_b;
    if (typeof addr!=='string' && addr.loc!=='/') {
        const oldaddr=get(addresses)[ get(ntab)];
        let {basket,hook,loc}=parsePointer(oldaddr);

        if (typeof addr.loc=='string') loc=addr.loc;
        if (typeof addr.basket=='string') basket=addr.basket;
        addr=serializePointer(basket, loc, hook);
    } else {
        if (addr.loc) addr=addr.loc;
    }
    
    if (newtab) {
        addtab(addr,addresses);
    } else {
        const addrs=get(addresses);
        addrs[get(ntab)]=addr;
        addresses.set(addrs);
    
    }
}

export const addtab=(addr='/',addresses=addresses_b,remove=false)=>{
    const addrs=get(addresses);
    if (!addr) addr='/';
    addrs.push(addr);
    if (addresses===addresses_a) ntab_a.set(addrs.length-1)
    else ntab_b.set(addrs.length-1);
    addresses.set(addrs);
    if (remove) copyAddress(''); //clear after add to tab
}

export const inserttab=(addr='/',at=0,addresses=addresses_b)=>{
    const addrs=get(addresses);
    addrs.splice(at,0,addr);

    addresses.set(addrs);
}
export const removetab=(n,addresses=addresses_b)=>{
    const addrs=get(addresses);
    if (n<0 || n >addrs.length-1) return;
    if (addrs.length<2)return;
    const ntab=addresses===addresses_a?ntab_a:ntab_b;
    const nt=get(ntab);
    if (nt && nt>n) ntab.set(nt-1);     
    addrs.splice(n,1);
    addresses.set(addrs);
}
export const resettab=(n,addresses=addresses_b)=>{
    const addrs=get(addresses);
    if (n<0 || n >addrs.length-1) return;
    addrs[n]='/';
    addresses.set(addrs);
}

export const getSide=()=>{
    return (getContext('ntab')==ntab_a)?'a':'b';
}

vstate.subscribe(vstate=>updateSettings({vstate}));