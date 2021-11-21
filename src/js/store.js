import {updateSettings,settings} from './savestore.js'
import {derived, writable ,get} from "svelte/store";
import { toSim } from 'lossless-simplified-chinese';

export const tosim=writable(settings.tosim);
export const systemsetting=writable(false);
export const cursor=writable({});
export const panepos=writable(settings.panepos);
export const _=str=>toSim( str,get(tosim));



export const activeside=writable(0);
export const searchbox=writable({});
export const searchhelp=writable(false);

export const renderer=writable({});   //custom renderer for different format
export const labeler=writable({});   //custom components for labels

export const labelerOf=cls=>{
    if (!cls) return;
    const L=get(labeler);
    return L[cls];
}

tosim.subscribe(tosim=>updateSettings({tosim}));
panepos.subscribe(panepos=>updateSettings({panepos}));


