import {updateSettings,settings} from './savestore.js'
import { writable ,get} from "svelte/store";
import { toSim } from 'lossless-simplified-chinese';
import { offtext2indic } from 'provident-pali';
export const tosim=writable(settings.tosim);
export const palitrans=writable(settings.palitrans);
export const systemsetting=writable(false);
export const aligning=writable(false);
export const cursor=writable({});
export const panepos=writable(settings.panepos);

export const _=(text,sim,script)=>{
    if (typeof sim=='undefined') sim=get(tosim);
    let t=text;
    if (script) t=offtext2indic(text,script);
    else if (parseInt(sim)) t=toSim(text,sim);
    return t;
};


export const showFrontPage=writable(false);
export const activeside=writable(0);
export const searchbox=writable({});
export const searchhelp=writable(false);

export const renderer=writable({});   //renderer for different format
export const filterer=writable({});   //filterer for filtering mode
export const labeler=writable({});   //custom components for labels
export const searchstore=writable({});   //search result cache 
export const picked=writable({text:''});    //picked Word and it context
export const labelerOf=cls=>{
    if (!cls) return;
    const L=get(labeler);
    return L[cls];
}

tosim.subscribe(tosim=>updateSettings({tosim}));
palitrans.subscribe(palitrans=>updateSettings({palitrans}));
panepos.subscribe(panepos=>updateSettings({panepos}));


