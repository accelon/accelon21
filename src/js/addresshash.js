import { openBasket, PATHSEP, ADDRSEP} from 'pitaka';
import { parsePointer } from 'pitaka/offtext';
import { addresses_a, addresses_b ,updateUrl} from './addresses';

const completeAddress=arr=>{
    let prevbasket='';
    for (let i=0;i<arr.length;i++) {
        const {basket}=parsePointer(arr[i]);
        if (!basket) {
            if (prevbasket&&arr[i]!==PATHSEP) arr[i]=PATHSEP+prevbasket+PATHSEP+arr[i];
        } else prevbasket=basket;
    }
}

const enumBasketInAddress=(arr)=>{
    const pitakas={};
    arr.forEach(ptr=>{
        const {basket}=parsePointer(ptr);
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
    const a=addrs_a.split(ADDRSEP);
    const b=(addrs_b||'').split(ADDRSEP);
    if (!a.length) a.push(PATHSEP);
    if (!b.length) b.push(PATHSEP);
    completeAddress(a);
    completeAddress(b);
    return {a,b}
}


export const loadaddress=async cb=>{
    const config=window.accelon21_configuration;
    if (!config)return;
 
    const {a,b}=addressesFromUrl();

    const addrs_a=(a||[config.init_a||PATHSEP]).filter(it=>!!it);
    const addrs_b=(b||[config.init_b||PATHSEP]).filter(it=>!!it);
    if (!addrs_a.length) addrs_a.push(config.init_a);
    if (!addrs_b.length) addrs_b.push(config.init_b);
    const addrs=addrs_a.concat(addrs_b);
    addrs.push(config.init_a);
    addrs.push(config.init_b);
    const pitakaNeeded=enumBasketInAddress(addrs);
    cb(pitakaNeeded,config);
    for (let i=0;i<pitakaNeeded.length;i++){
        const ptk=await openBasket(pitakaNeeded[i]);
        if (ptk) cb(pitakaNeeded,config);
    }
    if (!config.advance) config.advance={};
    if (!config.advance.keepLog) console.clear();
    addresses_a.set(addrs_a);
    addresses_b.set(addrs_b);
    addresses_b.subscribe(updateUrl);
    addresses_a.subscribe(updateUrl);
}