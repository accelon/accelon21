import {settings,updateSettings} from './savestore.js'
import { writable ,get} from "svelte/store";

export const QUERYSEP='^';
const MAXQUERYHISTORY=15;
export const queryhistory=writable(settings.queryhistory);

export const activetofind=writable('');
export const runquerycount=writable(0);

export const addqueryhistory=str=>{
    const qhis=get(queryhistory).split(QUERYSEP);
    const at=qhis.indexOf(str);
    if (at>-1) qhis.splice(at,1);
    qhis.unshift(str);
    if (qhis.length>MAXQUERYHISTORY) qhis.length=MAXQUERYHISTORY;
    queryhistory.set(qhis.join(QUERYSEP));
}

queryhistory.subscribe(queryhistory=>updateSettings({queryhistory}));