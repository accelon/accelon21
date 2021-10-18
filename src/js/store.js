import {updateSettings,settings} from './savestore.js'
import {derived, writable ,get} from "svelte/store";


export const tosim=writable(settings.tosim);
export const systemsetting=writable(false);
export const cursor=writable({});
export const panepos=writable(settings.panepos);


export const searchbox=writable({});

export const renderer=writable({});   //custom renderer for different format
export const labeler=writable({});   //custom components for labels

export const labelerOf=cls=>{
    if (!cls) return;
    const L=get(labeler);
    return L[cls];
}
tosim.subscribe(tosim=>updateSettings({tosim}));

panepos.subscribe(panepos=>updateSettings({panepos}));

