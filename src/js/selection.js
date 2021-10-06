const ENDINGCHARS= /[^\u3fff-\u9fff\dA-Za-z]/ ;
import {parseOfftextLine, makeHook } from 'pitaka/offtext'

export const getTextHook=(ptk,evt)=>{
    const selection=getSelection();
    const an=selection.anchorNode;
    const ele=an.parentElement;
    if (ele.tagName!=='T') return null;

    let sel=selection.toString();
    let offset=selection.anchorOffset;
    
    const x=parseInt(ele.attributes.x.value)+offset;
    const y=parseInt(ele.attributes.y.value);
    let punc=an.data.substr(offset).match(ENDINGCHARS);
    let end=offset+20;
    if (punc) end=punc.index;
    let t=an.data.substr(offset,end);
    const [linetext]=parseOfftextLine(ptk.getLine(y));
    let ori=linetext.substr(offset);
    punc=ori.match(ENDINGCHARS);
    if (punc) ori=ori.substr(0,punc.index); //original text
    const hook=makeHook(linetext, x, sel.length);

    return {hook,x,y, sel , t, ori}
}

export const setSelection=(startnode,x,endnode,x2)=>{
    if (x>=x2) x2=x+1;
    let range=new Range();
    range.setStart(startnode.firstChild,x);
    range.setEnd(endnode.firstChild,x2);
    
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
}

export const getCursorWord=()=>{
    const sel=getSelection();
    let tofind=sel.toString();
    let offset=sel.anchorOffset;
    
    if (tofind.trim()) {
        return {tofind,offset,anchor:sel.anchorNode}
    }

    const psib=sel.anchorNode.previousSibling ;
    if (psib && psib.dataset&& psib.dataset.offset) {
        offset+=parseInt(psib.dataset.offset)+psib.innerText.length;
    }
    const ori=sel.anchorNode.parentElement.dataset.ori
    if (!ori && !sel.anchorNode.data)return;
    let str=(ori||sel.anchorNode.data).replace(/<.+?>/g,'');;
    let dictch=str.substr(offset,50);

    tofind=dictch;

    return {tofind,offset,anchor:sel.anchorNode}
}