import {updateSettings,settings} from './savestore.js'
import {derived, writable ,get} from "svelte/store";
import {getUserData,setUserData} from './userdata.js';
export const tosim=writable(settings.tosim);

export const vstate=writable(settings.vstate||{});

export const userdata=writable({});
export const cursor=writable({});
export const panepos=writable(settings.panepos);

export const addresses=writable(['/openlit/12/1','/openlit/6/1']);
export const ntab=writable(0);
export const searchbox=writable({});

export const renderer=writable({});   //custom renderer for different format
export const labeler=writable({});   //custom components for labels

export const labelerOf=cls=>{
    if (!cls) return;
    const L=get(labeler);
    return L[cls];
}
tosim.subscribe(tosim=>updateSettings({tosim}));
vstate.subscribe(vstate=>updateSettings({vstate}));
panepos.subscribe(panepos=>updateSettings({panepos}));

export const setLoc=async ({ptk,loc,y,hook=''},store)=>{
    if (!ptk) ptk=get(store).ptk;
    const items=ptk.fetchPage(loc);

    y=y|| (items.length&&items[0].key)||0;
    
    await ptk.prefetchLines(y,y+items.length);
    vstate.set(Object.assign(get(vstate),{name:ptk.name,loc,hook,y}))    

    //get foriegn links
    const backlinks=ptk.getBacklinks(loc);
    items.forEach(item=>{
        for (let ptkname in backlinks) {
            if (backlinks[ptkname][item.key]) {
                item.backlinks=backlinks[ptkname][item.key];
            }
        }
    })

    const userdata=getUserData(vstate.name,vstate.loc);

    if (store) {
        store.set( {items,userdata,backlinks,ptk,loc})
    } else {
        return {items,backlinks,userdata,loc};
    }
}

export const gotab=n=>{
    const addrs=get(addresses);
    if (n>9 || n<0) return;
    for (let i=0;i<n+1;i++) {
        if (!addrs[i]) addrs[i]='/';
    } 
    addresses.set(addrs);
    ntab.set(n);
}

export const cleartab=n=>{
    if (n>9 || n<0) return;
    const addrs=get(addresses);
    addrs[n]='/';
    addresses.set(addrs);
}