import {updateSettings,settings} from './savestore.js'
import { derived, writable } from "svelte/store";

export const tosim=writable(settings.tosim);

export const column=writable(settings.column);
export const activecolumn=writable(0);
export const targetcolumn=writable(0);
export const col1=derived([column,activecolumn],([c,ac])=> ac==0?'auto':'none'  );
export const col2=derived([column,activecolumn],([c,ac])=> ac==1?'auto':'none'  );
export const col3=derived([column,activecolumn],([c,ac])=> ac==2?'auto':'none'  );

export const cols={col1,col2,col3};

export const vs0=writable({name:'openlit'});
export const vs1=writable({name:''});
export const vs2=writable({name:''});
export const vstates=[vs0,vs1,vs2];

export const renderer=writable({});

tosim.subscribe(tosim=>updateSettings({tosim}));
column.subscribe(column=>updateSettings({column}));