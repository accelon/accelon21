import {getContext} from 'svelte'
import {writable,get} from 'svelte/store'
import {parseAddress ,stringifyAddress} from 'pitaka/offtext';
import {getUserNotes} from './usernotes.js'
import {getBookmarks} from './bookmarks.js'
import {getUserData,setUserData} from './userdata.js';
import {ADDRSEP, DELTASEP, useBasket } from 'pitaka';
import {activeside, showFrontPage} from './store.js'
export const addresses_a=writable([]);
export const addresses_b=writable([]);
export const activeoffset=writable([0,0]);

export const userdata=writable({});
export const selectorShown=writable(false);
export const chunkFromAddress=(ptk,{loc,dy})=>{
    if (typeof dy!=='number') dy=parseInt(dy)||0;
    const range=ptk.getPageRange(loc);
    const chunk=ptk.chunkOf(range[0]+dy);
    const [y0,y1]=ptk.getPageRange(ptk.pageLoc(chunk.address));
    dy=range[0]+dy - y0;

    return {y0,dy,linecount:y1-y0};
}
export const loadAlignedLines=async (ptk,loc,dy)=>{
    const page=chunkFromAddress(ptk,{loc,dy})
    const y0=page.y0;
    if (!y0) return;
    await ptk.prefetchLines(y0,y0+page.linecount);
}
export const setLoc=async ({ptk,loc,y0,dy,aligned},store)=>{
    const old=get(store);
    if (!ptk) ptk=get(store).ptk;

    if (get(store).loc==loc && get(store).ptk===ptk) {
        return; //nothing to do
    }
    const items=[];

    const page=chunkFromAddress(ptk,{loc,dy})
    y0=page.y0|| (items.length&&items[0].key)||0;
    dy=page.dy;
    const notes=await ptk.getNotes(y0,page.linecount);
    for (let i=y0;i<y0+page.linecount;i++) {
        items.push({key:i,notes:notes[i]});
    }
    const criteria=get(store).criteria||{};

    await ptk.prefetchLines(y0,y0+items.length);
    const alignedPtk=aligned.map(n=>n&&useBasket(n)).filter(it=>!!it);
    
    for (let i=0;i<alignedPtk.length;i++) {
        await loadAlignedLines(alignedPtk[i],loc,dy);
    }

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
    /* 
    y0 is the first line of cluster, dy is delta from y0
    loc is the nearest locator
    */
    const out=Object.assign(old,{items,backlinks,ptk,loc,mulu,y0,criteria,usernotes,bookmarks,dy});
    store.set(out);
}
const packAddresses=arr=>{
    let prevbasket='';
    const out=[];
    for (let i=0;i<arr.length;i++) {
        const {basket}=parseAddress(arr[i]);
        if (!basket) continue;
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
    const {basket,loc,dy,attrs}=parseAddress(addrs[0].address);
    const newattrs= Object.assign(attrs,_attrs);
    for (let key in newattrs) {
        if (!newattrs[key]&&typeof newattrs[key]!=='number') delete newattrs[key];
    }
    const newaddr=stringifyAddress(basket,loc,'',dy,newattrs);
    addrs[0].address=newaddr;
    addresses.set(addrs)
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
    const addr2=parseAddress(address2);
    if (!addr1||!addr2) return false;
    const ptk1=useBasket(addr1.basket);
    const ptk2=useBasket(addr2.basket);
    if (!ptk1 || !ptk2) return false;
    if (!ptk1.aligned.includes(ptk2.header.name)) return;

    const ck1=ptk1.chunkOf(addr1.loc );
    const ck2=ptk2.chunkOf(addr2.loc );
    return ck1.id==ck2.id;

    /*
    const ptk=useBasket(addr1.basket);
    const [y]=ptk.getPageRange(addr1.loc);
    const parallels=ptk.getParallelLinks(y);
    
    return parallels.filter( it=>address2.startsWith(it.address) ).length>0;
    */
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
export const getOppositeAddress=(addresses_side=addresses_b)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    const addrs=getOppositeAddresses(addresses)
    if (addrs.length) return addrs[0];
}
export const setActiveLine=(ptk,addresses_side=addresses_b,newy=0,y0=0)=>{
    let addresses=addresses_side;
    if (typeof addresses_side=='number') {
        addresses=addresses_side==0?addresses_a:addresses_b;
    }
    if (typeof newy!=='number') {
        console.log('invalid newy ');
        return;
    }
    const addrs=get(addresses);
    if (!addrs.length) return;
    
    const optr=parseAddress(addrs[0].address);
    const loc=ptk.locOf(newy);
    const ptr=parseAddress(loc);
    const locY=ptk.locY(ptr.loc);
    const dy= newy - locY;
    activeside.set(addresses==addresses_b?1:0);
    if (optr.loc!==loc || optr.dy!==dy) {
        optr.loc=ptr.loc;
        optr.dy=dy;
        const newaddr=stringifyAddress(optr);
        setAddress(addresses,newaddr);
    
        const oaddrs=get(getOppositeAddresses(addresses));
        if ( oaddrs.length&& isParallel(addrs[0].address, oaddrs[0].address) ) {
            const optr2=parseAddress(oaddrs[0].address);
            optr2.dy=dy;
            optr2.loc=ptr.loc;
            setAddress(getOppositeAddresses(addresses),stringifyAddress(optr2));
        }
    }
}
export const sameChunk=(addr1,addr2)=>{
    const ptr1=parseAddress(addr1);
    const ptr2=parseAddress(addr2);
    if (!ptr1 || !ptr1) return false;
    if (ptr1.basket!==ptr2.basket) return false;
    const ptk1=  useBasket(ptr1.basket);
    const ptk2=  useBasket(ptr2.basket);
    if (!ptk1|| !ptk2) return false;
    const c1=ptk1.chunkOf(ptr1.loc);
    const c2=ptk2.chunkOf(ptr2.loc);
    return c1.address===c2.address;
}
export const newopposite=(addresses_side,address)=>{
    const opposite=getOppositeAddresses(addresses_side);
    const oaddrs=get(opposite);
    if (!oaddrs.length || !sameChunk(address,oaddrs[0].address)) settab(opposite,address,{newtab:true});
    else if (oaddrs.length) settab(opposite,address);
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
    const ptr=parseAddress(get(addresses)[0]);
    return ptr.dy + ptr.y;
}
export const moveTop=(addresses,idx)=>{
    if (idx<1)return;
    const addrs=get(addresses);
    const top=addrs.splice(idx,1)[0];
    addrs.unshift(top);
    addresses.set(addrs);
}
const findBasketHomepage=(addresses,basket)=>{
    const addrs=get(addresses);
    for (let i=0;i<addrs.length;i++) {
        const ptr=parseAddress(addrs[i].address);
        if (ptr.basket==basket && !ptr.loc) {
            return i;
        }
    }
    return -1;
}
export const closetab=(addresses,gohome=false)=>{
    const addrs=get(addresses);
    let basket='';
    if (!addrs.length) {
        selectorShown.set(false); //frontpage cannot show tabselector
    } else {
        basket = parseAddress(addrs[0].address).basket;
        addrs.shift();
    }
    if (gohome) {
        const idx=findBasketHomepage(addresses,basket);
        if (idx==-1) { //create a new basket homepage
            addrs.unshift({key:newaddrkey(),address:stringifyAddress({basket,loc:''})})
        } else {
            moveTop(addresses,idx);
        }
    }
    addresses.set(addrs);
}
let addrkey=0;
export const newaddrkey=()=>(++addrkey).toString(16).padStart(4,'0');
export const getOppositeAddresses=addresses=>addresses_b==addresses?addresses_a:addresses_b;