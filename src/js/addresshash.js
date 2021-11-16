import { openBasket, PATHSEP, ADDRSEP} from 'pitaka';
import { parsePointer } from 'pitaka/offtext';
import { addresses_a, addresses_b } from './addresses';
import { get } from 'svelte/store';
const completeAddress=arr=>{
    let prevbasket='';
    for (let i=0;i<arr.length;i++) {
        const {basket}=parsePointer(arr[i]);
        if (!basket) {
            if (prevbasket) arr[i]=PATHSEP+prevbasket+PATHSEP+arr[i];
        } else prevbasket=basket;
    }
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
const updateUrl=()=>{
    const a=packAddresses(get(addresses_a));
    const b=packAddresses(get(addresses_b));
    window.location.hash='a='+a+'&b='+b;
}
const addressesFromUrl=()=>{
    let hash=window.location.hash;
    if (hash[0]=='#') hash=hash.substr(1);
    const params=new URLSearchParams(hash);
    const a=(params.get('a')||'').split(';');
    const b=(params.get('b')||'').split(';');
    if (!a.length) a.push(PATHSEP);
    if (!b.length) b.push(PATHSEP);
    completeAddress(a);
    completeAddress(b);
    return {a,b}
}
const pitakaInAddress=(arr)=>{
    const pitakas={};
    arr.forEach(ptr=>{
        const {basket}=parsePointer(ptr);
        if (!basket) return;
        if (!pitakas[basket]) pitakas[basket]=0;
        pitakas[basket]++;
    });
    return Object.keys(pitakas);
}
export const loadaddress=cb=>{
    const config=window.accelon21_configuration;
    if (!config)return;
    const jobs=[];

    const {a,b}=addressesFromUrl();

    const addrs_a=(a||[config.init_a||PATHSEP]).filter(it=>!!it);
    const addrs_b=(b||[config.init_b||PATHSEP]).filter(it=>!!it);

    const pitakaNeeded=pitakaInAddress(addrs_a.concat(addrs_b));

    pitakaNeeded.forEach(ptk=>{
        jobs.push(openBasket(ptk))
    })
    if (!config.advance) config.advance={};
    Promise.all(jobs).then(()=>{
        if (!config.advance.keepLog) console.clear();
        addresses_a.set(addrs_a);
        addresses_b.set(addrs_b);
        addresses_b.subscribe(updateUrl);
        addresses_a.subscribe(updateUrl);
        cb&&cb(config);
    });
}