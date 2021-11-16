import {openBasket, PATHSEP} from 'pitaka';
import { parsePointer } from 'pitaka/offtext';
import { addresses_a,addresses_b } from './addresses';

const addressesFromUrl=()=>{
    const hash=window.location.hash.substr(1);
    const params=new URLSearchParams(hash);
    const a=params.get('a')||'';
    const b=params.get('b')||'';
    return {a:a.split(';'),b:b.split(';')}
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
        cb&&cb(config);
    });
}