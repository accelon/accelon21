import {updateSettings,settings} from './savestore.js'
import { derived, writable ,get} from "svelte/store";
import {getUserData,setUserData} from './userdata.js';

export const tosim=writable(settings.tosim);

export const column=writable(settings.column);
export const activecolumn=writable(0);
export const targetcolumn=writable(0);
export const col1=derived([column,activecolumn],([c,ac])=> ac==0?'auto':'none'  );
export const col2=derived([column,activecolumn],([c,ac])=> ac==1?'auto':'none'  );
export const col3=derived([column,activecolumn],([c,ac])=> ac==2?'auto':'none'  );

export const cols={col1,col2,col3};
export const vs0=writable({});
export const vs1=writable({});
export const vs2=writable({});
vs0.set(Object.assign({},settings.vs0));
vs1.set(Object.assign({},settings.vs1));
vs2.set(Object.assign({},settings.vs2));

export const userdata=writable({});
export const cursor=writable({});

export const vl0=writable([]);
export const vl1=writable([]);
export const vl2=writable([]);
export const vstates=[vs0,vs1,vs2];
export const vlines=[vl0,vl1,vl2];
export const searchbox=writable({});

export const renderer=writable({});

tosim.subscribe(tosim=>updateSettings({tosim}));
column.subscribe(column=>updateSettings({column}));
vs0.subscribe(vs0=>updateSettings({vs0}));
vs1.subscribe(vs1=>updateSettings({vs1}));
vs2.subscribe(vs2=>updateSettings({vs2}));

export const  setLoc=async (ptk,col,loc,y,hook='')=>{
    const vstate=vstates[col];
    const vline=vlines[col];
    setUserData(vstate.name,vstate.loc, get(vline).userdata );
    const items=ptk.fetchPage(loc);

    y=y|| (items.length&&items[0].key)||0;
    await ptk.prefetchLines(y,y+items.length);
    vstate.set(Object.assign(get(vstate),{name:ptk.name,loc,hook,y}))    

    const userdata=getUserData(vstate.name,vstate.loc);
    vline.set(Object.assign(get(vline),{items, userdata}));
}