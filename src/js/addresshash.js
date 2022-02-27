import { openBasket, PATHSEP, ADDRSEP} from 'pitaka';
import { parseAddress } from 'pitaka/offtext';
import { addresses_a, addresses_b ,updateUrl,newaddrkey} from './addresses';
import {get } from 'svelte/store'
const completeAddress=arr=>{
    let prevbasket='';
    for (let i=0;i<arr.length;i++) {
        const {basket}=parseAddress(arr[i]);
        if (!basket) {
            if (prevbasket&&arr[i]!==PATHSEP) arr[i]=prevbasket+arr[i];
        } else prevbasket=basket;
    }
}

const enumBasketInAddress=(arr)=>{
    const pitakas={};
    arr.forEach(ptr=>{
        const {basket}=parseAddress(ptr);
        if (!basket) return;
        if (!pitakas[basket]) pitakas[basket]=0;
        pitakas[basket]++;
    });
    return Object.keys(pitakas);
}

const addressesFromUrl=()=>{
    let hash=window.location.hash;
    if (hash[0]=='#') hash=hash.substr(1);
    hash=decodeURI(hash);
    const [addrs_a,addrs_b]=hash.split('#');
    const a=addrs_a.split(ADDRSEP).filter(it=>!!it);
    const b=(addrs_b||'').split(ADDRSEP).filter(it=>!!it);
    completeAddress(a);
    completeAddress(b);
    return {a,b}
}

export const loadaddress=()=>{
    const config=window.accelon21_configuration||{keepLog:true};
    if (!config.preload) { //get basket from pathname
        let pathname=decodeURI(location.pathname).replace(/\.html?/,'');
        const at=pathname.lastIndexOf('/');
        pathname=pathname.substr(at+1);
        config.preload=pathname.replace(/[^\da-z\-]+/g,',');
    }

    const {a,b}=addressesFromUrl();

    const addrs_a=a.filter(it=>!!it);
    const addrs_b=b.filter(it=>!!it);

    const addrs=addrs_a.concat(addrs_b);
    
    // addrs.push(config.init_a); addrs.push(config.init_b);//load ptk in config

    const pitakaNeeded=enumBasketInAddress(addrs);
    
    if (config.preload) {
        pitakaNeeded.push( ... (config.preload.split(/[,;]/).filter(it=>!!it)) ); 
    }
    
    if (!config.keepLog) console.clear();
    const A=addrs_a.map(a=>{ return {key:newaddrkey()+'A', address:a} } );
    const B=addrs_b.map(a=>{ return {key:newaddrkey()+'B', address:a} } );
    addresses_a.set(A);
    addresses_b.set(B);

    addresses_b.subscribe(updateUrl);
    addresses_a.subscribe(updateUrl);

    return pitakaNeeded;
}