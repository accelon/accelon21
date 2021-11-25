import {settings,updateSettings} from './savestore.js'
import { writable ,get} from "svelte/store";

export const QUERYSEP='^';
const MAXQUERYHISTORY=15;
export const queryhistory=writable(settings.queryhistory);
export const bookqueryhistory=writable(settings.bookqueryhistory);

export const activetofind=writable('');
export const activebooktofind=writable('');
export const runquerycount=writable(0);

export const addqueryhistory=(str,history=queryhistory)=>{
    const qhis=get(history).split(QUERYSEP);
    const at=qhis.indexOf(str);
    if (at>-1) qhis.splice(at,1);
    qhis.unshift(str);
    if (qhis.length>MAXQUERYHISTORY) qhis.length=MAXQUERYHISTORY;
    history.set(qhis.join(QUERYSEP));
}

export const addbookqueryhistory=str=>{
    addhistory(query,bookqueryhistory);
}

queryhistory.subscribe(queryhistory=>updateSettings({queryhistory}));
bookqueryhistory.subscribe(bookqueryhistory=>updateSettings({bookqueryhistory}));