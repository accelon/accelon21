import {getContext} from 'svelte'
import {writable,get} from 'svelte/store'
import {parseAddress ,serializePointer} from 'pitaka/offtext';
import {getUserNotes} from './usernotes.js'
import {getBookmarks} from './bookmarks.js'
import {getUserData,setUserData} from './userdata.js';
import {PATHSEP,ADDRSEP, DELTASEP, useBasket } from 'pitaka';
import {activeside, showFrontPage} from './store.js'
export const addresses_a=writable([]);
export const addresses_b=writable([]);
export const activeoffset=writable([0,0]);

export const userdata=writable({});
export const selectorShown=writable(false);
export const setLoc=async ({ptk,loc,y0,hook='',dy},store)=>{
    const old=get(store);
    if (!ptk) ptk=get(store).ptk;

    if (get(store).loc==loc && get(store).ptk===ptk) {
        return; //nothing to do
    }

    const atdelta=loc&&loc.indexOf(DELTASEP);
    if (atdelta>0) {
        dy=parseInt(loc.substr(atdelta+1));
        loc=loc.substr(0,atdelta);
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


    const out=Object.assign(old,{items,backlinks,ptk,loc,mulu,y0,criteria,usernotes,bookmarks,dy});
    store.set(out)
}
const packAddresses=arr=>{
    let prevbasket='';
    const out=[];
    for (let i=0;i<arr.length;i++) {
        const {basket}=parseAddress(arr[i]);
        if (prevbasket!==basket) out.push(arr[i]); 
        else out.push(arr[i].substr(basket.length));
        if (basket) prevbasket=basket;
    }
    return out.join(ADDRSEP);
}
export const updateUrl=()=>{
    const a=packAddresses(get(addresses_a).map(it=>it.address));
    const b=packAddresses(get(addresses_b).map(it=>it.address));
    window.location.hash='#'+a + (b?('#'+b):'');
}
export const setLocAttrs=(addresses_side=addresses_b,_attrs)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    const addrs=get(addresses);
    const {basket,loc,dy,attrs}=parsePointer(addrs[0].address);
    const newattrs= Object.assign(attrs,_attrs);
    for (let key in newattrs) {
        if (!newattrs[key]&&typeof newattrs[key]!=='number') delete newattrs[key];
    }
    const newptr=serializePointer(basket,loc,'',dy,newattrs);
    addrs[0].address=newptr;
    //addresses.set(addrs)
    updateUrl();
}
export const setAddress=(addresses_side=addresses_b,address)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    const addrs=get(addresses);

    addrs[0].address=address;
    addresses.set(addrs);
    updateUrl();
}
export const isParallel=(address1,address2)=>{
    const addr1=parseAddress(address1);
    const ptk=useBasket(addr1.basket);
    const [y]=ptk.getPageRange(addr1.loc);
    const parallels=ptk.getParallelLinks(y);
    
    return parallels.filter( it=>address2.startsWith(it.address) ).length>0;
}
export const setActiveOffset=(addresses_side=addresses_b,offset=0)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    const side=getSide(addresses);
    const ao=get(activeoffset);
    ao[side]=offset;
    activeoffset.set(ao);
}
export const getOppositeActiveOffset=(addresses_side=addresses_b,offset=0)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    const side=getSide(getOppositeAddresses(addresses));
    return get(activeoffset)[side];
}
export const setActiveLine=(addresses_side=addresses_b,newy=0,y0=0)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    if (typeof newy!=='number')return;
    const addrs=get(addresses);
    const {basket,loc,dy,attrs}=parseAddress(addrs[0].address);

    activeside.set(addresses==addresses_b?1:0);
    const newdy=newy-y0;
    if (newdy>=0&&newdy!==dy) {
        const newptr=serializePointer(basket,loc,'',newdy,attrs);
        setAddress(addresses,newptr);
    
        const oaddrs=get(getOppositeAddresses(addresses));
        if (get(activeside)==0 && oaddrs.length&& isParallel(addrs[0].address, oaddrs[0].address) ) {
            
            const {basket,loc,dy,attrs}=parseAddress(oaddrs[0].address);
            const newptr=serializePointer(basket,loc,'',newdy,attrs);
            setAddress(getOppositeAddresses(addresses),newptr);
        }
    }
}
export const newopposite=(addresses_side,address)=>{
    const opposite=getOppositeAddresses(addresses_side);
    settab(opposite,address,{newtab:true});
}
export const settab=(addresses_side,address,{newtab=false}={})=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    const addrs=get(addresses);

    if (newtab || !addrs.length) {
        addrs.unshift({key:newaddrkey(), address});
    } else {
        addrs[0].address=address;
    }
    addresses.set(addrs);
    showFrontPage.set(false)
}

export const getSide=address=>{
    address=address||getContext('addresses');
    return (address==addresses_a)?0:1;
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
    }
    addresses.set(addrs);
}
let addrkey=0;
export const newaddrkey=()=>(++addrkey).toString(16).padStart(4,'0');
export const getOppositeAddresses=addresses=>addresses_b==addresses?addresses_a:addresses_b;