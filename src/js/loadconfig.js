import {openBasket} from 'pitaka';

export const loadconfig=cb=>{
    const config=window.accelon21_configuration;
    if (!config)return;
    const jobs=[];

    if (config.addresses_a.length==0) config.addresses_a.push('/');
    if (config.addresses_b.length==0) config.addresses_b.push('/');
    config.preload&&config.preload.split(/[,;]/).forEach(ptk=>{
        jobs.push(openBasket(ptk))
    })
    if (!config.advance) config.advance={};
    Promise.all(jobs).then(()=>{
        if (!config.advance.keepLog) console.clear();
        cb&&cb(config);
    });
}