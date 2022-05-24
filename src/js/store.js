import {updateSettings,settings} from './savestore.js'
import { writable ,get} from "svelte/store";
import { toSim } from 'lossless-simplified-chinese';
import {factorizeText} from 'pitaka/pali';
import { offtext2indic} from 'provident-pali';
export const tosim=writable(settings.tosim||0);
export const edict=writable(settings.edict||0);
export const palitrans=writable(settings.palitrans);
export const factorization=writable(settings.factorization);
export const systemsetting=writable(false);
export const aligning=writable(false);
export const cursor=writable({});
export const panepos=writable(settings.panepos);
export const fatalerror=writable('');

export const _=(lang,text,sim,palitrans,maxlen)=>{
    if (typeof sim=='undefined') sim=get(tosim);
    const script=lang=='pl' && palitrans;
    let t=text;
    if (script!==false && typeof script!=='undefined') {
        if (parseInt(get(factorization))>0) t=factorizeText(t, true ,script);
        t=offtext2indic(t,script);
    }
    else if (parseInt(sim)) t=toSim(t,sim);
    t=t||'';
    if (lang=='en' && maxlen) maxlen*=2;
    if (maxlen&&t.length>maxlen) {
        t=t.slice(0,maxlen)+'...';
    }

    return t||'';
};


export const showFrontPage=writable(false);
export const activeside=writable(0);
export const searchbox=writable({});
export const searchhelp=writable(false);

export const renderer=writable({});   //renderer for different format
export const filterer=writable({});   //filterer for filtering mode
export const labeler=writable({});   //custom components for labels
export const searchstore=writable({});   //search result cache 
export const picked=writable({word:'',lexeme:''});    //picked Word and it context
export const labelerOf=cls=>{
    if (!cls) return;
    const L=get(labeler);
    return L[cls];
}

tosim.subscribe(tosim=>updateSettings({tosim}));
edict.subscribe(edict=>updateSettings({edict}));
palitrans.subscribe(palitrans=>updateSettings({palitrans}));
factorization.subscribe(factorization=>updateSettings({factorization}));
panepos.subscribe(panepos=>updateSettings({panepos}));


