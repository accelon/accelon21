import {settings,updateSettings} from './savestore.js'
import { writable ,get} from "svelte/store";

export const QUERYSEP='^';
const MAXQUERYHISTORY=15;
const queryhistory_=writable(settings.queryhistory);
const queryhistory_zh=writable(settings.queryhistory_zh);
const queryhistory_pl=writable(settings.queryhistory_pl);
const queryhistory_en=writable(settings.queryhistory_en);
export const queryhistories={ '':queryhistory_, zh:queryhistory_zh, pl:queryhistory_pl, en:queryhistory_en}
export const bookqueryhistory=writable(settings.bookqueryhistory);

export const activetofind=writable('');
export const activebooktofind=writable('');
export const runquerycount=writable(0);

export const queryhistory=(lang,getstore=false)=>{
    const history=queryhistories[lang]|| queryhistories[''];
    if (getstore) return history;
    return get(history).split(QUERYSEP);
}
export const addqueryhistory=(str,lang,history)=>{
    history=history||queryhistory(lang,true);
    const qhis=get(history).split(QUERYSEP);
    str=str.trim();
    const at=qhis.indexOf(str);
    if (at>-1) qhis.splice(at,1);
    qhis.unshift(str);
    if (qhis.length>MAXQUERYHISTORY) qhis.length=MAXQUERYHISTORY;
    history.set(qhis.join(QUERYSEP));
}

export const addbookqueryhistory=(str,lang)=>{
    addhistory(query,lang,bookqueryhistory);
}

queryhistory_en.subscribe(queryhistory_en=>updateSettings({queryhistory_en}));
queryhistory_pl.subscribe(queryhistory_pl=>updateSettings({queryhistory_pl}));
queryhistory_zh.subscribe(queryhistory_zh=>updateSettings({queryhistory_zh}));
queryhistory_.subscribe(queryhistory=>updateSettings({queryhistory}));
bookqueryhistory.subscribe(bookqueryhistory=>updateSettings({bookqueryhistory}));