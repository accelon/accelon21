import { openBasket, PATHSEP, ADDRSEP} from 'pitaka';
import { parseAddress } from 'pitaka/offtext';
import { addresses_a, addresses_b ,updateUrl,newaddrkey} from './addresses';

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

export const loadaddress=async cb=>{
    const config=window.accelon21_configuration;
    if (!config)return;
 
    const {a,b}=addressesFromUrl();

    const addrs_a=a.filter(it=>!!it);
    const addrs_b=b.filter(it=>!!it);

    const addrs=addrs_a.concat(addrs_b);
    
    // addrs.push(config.init_a); addrs.push(config.init_b);//load ptk in config


    const pitakaNeeded=enumBasketInAddress(addrs);
    if (config.preload) pitakaNeeded.push( ... config.preload.split(/[,;]/)); 

    cb(pitakaNeeded,config);
    for (let i=0;i<pitakaNeeded.length;i++){
        const ptk=await openBasket(pitakaNeeded[i]);
        if (ptk) cb(pitakaNeeded,config);
    }
    if (!config.advance) config.advance={};
    if (!config.advance.keepLog) console.clear();
    addresses_a.set(addrs_a.map(address=>({key:newaddrkey(), address})));
    addresses_b.set(addrs_b.map(address=>({key:newaddrkey(), address})));

    addresses_b.subscribe(updateUrl);
    addresses_a.subscribe(updateUrl);
}