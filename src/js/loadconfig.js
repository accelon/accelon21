import {openBasket} from 'pitaka';

export const loadconfig=cb=>{
    const config=window.accelon21_configuration;
    if (!config)return;
    const jobs=[];

    config.preload&&config.preload.split(/[,;]/).forEach(ptk=>{
        jobs.push(openBasket(ptk))
    })
    if (!config.advance) config.advance={};
    Promise.all(jobs).then(()=>{
        if (!config.advance.keepLog) console.clear();
        cb&&cb(config);
    });
}