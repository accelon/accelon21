import {parseHook} from 'pitaka/offtext'
import {setSelection} from './selection.js';

export const scrollToHook=(ptk,y,hook)=>{
    const linetext=ptk.getLine(y);
    if (!linetext)return;
    const {x,w,lead,leadn,end,endn}=parseHook(hook,linetext);

    const snips=document.querySelectorAll('t[y="'+y+'"]');
    let startnode=null,endnode=null,sx,ex;
    
    for (let i=0;i<snips.length;i++) {
        const snip=snips[i];
        if (!snip.innerText)continue;
        const X=parseInt(snip.attributes.x.value);
        if (x> X) {startnode=snip; sx=x-X; }
        if (x+w> X) {endnode=snip; ex=x+w-X;}
    }
    if (!startnode)return;
    setSelection(startnode,sx,endnode,ex);
    startnode.scrollIntoView();
    return startnode;
}