const ENDINGCHARS= /[^\u3fff-\u9fff\dA-Za-z]/ ;
import {makeHook } from 'pitaka/align'
import {calOriginalOffset,langSplitChar} from 'pitaka/pali'

const isSpace=(c,extrachars)=>{
    const code=c.charCodeAt(0);
    const isspace= code<=0x30 || (code >= 0x3000 && code<=0x3020)|| (code>=0x3A&& code<=0x40)||
     (code>=0x5B&& code<=0x60)|| (code>=0x7b&& code<=0xC0) || (code>=0x2000&&code<=0x2bff) || code>=0xfE10;

    if (extrachars) return isspace && c!==extrachars;
    else return isspace;
}
const getWordAt=(linetext,x, extrachars)=>{
    let start=x,end=x;

    while (start>0 && !isSpace(linetext.charAt(start),extrachars)) start--;
    if (isSpace(linetext.charAt(start),extrachars)) start++;
    while (end<linetext.length-1 && !isSpace(linetext.charAt(end),extrachars)) end++;
    return {start,end,text:linetext.substring(start,end)}
}

export const getTextHook=(ptk,evt,lang,palitrans)=>{
    if (!ptk)return{}
    const selection=getSelection();
    const an=selection.anchorNode;
    let ele;
    let sel=selection.toString();
    let offset=selection.anchorOffset;

    if (an.nodeType==3 && an.nextElementSibling) {
        ele=an.nextElementSibling;
        if (ele.tagName!=='T' && ele.firstElementChild.tagName==='T') {
            ele=ele.firstElementChild;
            offset--;
        }
    } else ele=an.parentElement;
    if (ele.tagName!=='T') return {};

    const oritext=ele.attributes.ori&&ele.attributes.ori.value;
    const linetext=oritext || ele.innerText;

    let w=sel.length;

    const x=parseInt(ele.attributes.x.value)||0;
    const xoffset=x+offset;
    const y=parseInt(ele.attributes.y.value);


    if (w+x>linetext.length) {
        w=linetext.length-xoffset;
        sel=sel.substring(0,w);
    }

    let punc=linetext.substr(xoffset).match(ENDINGCHARS);
    let t=linetext.substr(xoffset,w);
    
    let ori=linetext.substr(x);
    punc=ori.match(ENDINGCHARS);
    if (punc) ori=ori.substr(0,punc.index); //original text

    const hook=makeHook(linetext, x, w);
    const extrachars=langSplitChar(palitrans);
    const displayword=getWordAt(ele.innerText,offset,extrachars);
    const displaylexeme=getWordAt(ele.innerText,offset);

    const wordoffset=lang=='pl'?calOriginalOffset(displayword.start,ele.innerText, oritext):offset;

    const lexemeoffset=lang=='pl'?calOriginalOffset(displaylexeme.start,ele.innerText, oritext):offset;

    const word=getWordAt(linetext,wordoffset,extrachars).text;
    const lexeme=getWordAt(linetext,lexemeoffset).text;

    return {hook,x,y,sel , t, ori, word, lexeme, displayword:displayword.text,displaylexeme:displaylexeme.text}
}
export const markSelection=(ele,x,w)=>{
    while (ele&& (ele.tagName!=='T' && ele.tagName!=='DIV')) {
        ele=ele.parentElement;
    }
    const div=ele.tagName=='DIV'?ele:ele.parentElement;
    const allT=div.querySelectorAll('t[x]');

    const textSnippets=Array.from(allT).filter(item=>item.innerText).map(item=>
        [parseInt(item.attributes.x.value) ,item] );

    let startnode,endnode,startx,endx;

    for (let i=0;i<textSnippets.length;i++) {
        const [offset, node]=textSnippets[i];
        if (x>=offset) {
            startnode=node;
            startx=x-offset;
        }
        if (!endnode && offset+node.innerText.length>=x+w) {
            endx= x+w-offset;
            endnode=node;
            break;
        }
    }
    setSelection(startnode,startx,endnode,endx);
}

export const setSelection=(startnode,x,endnode,x2)=>{
    if (x>=x2) x2=x+1;
    if (!startnode)return;
    let range=new Range();
    if (x<startnode.firstChild.length) range.setStart(startnode.firstChild,x);
    if (x2>endnode.firstChild.length) x2=endnode.firstChild.length;
    range.setEnd(endnode.firstChild,x2);

    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
}

export const getCursorWord=()=>{
    const sel=getSelection();
    let cursorword=sel.toString();
    let offset=sel.anchorOffset;
    
    if (cursorword.trim()) {
        return {cursorword,offset,anchor:sel.anchorNode}
    }

    const psib=sel.anchorNode.previousSibling ;
    if (psib && psib.dataset&& psib.dataset.offset) {
        offset+=parseInt(psib.dataset.offset)+psib.innerText.length;
    }
    const ori=sel.anchorNode.parentElement.dataset.ori
    if (!ori && !sel.anchorNode.data)return;
    let str=(ori||sel.anchorNode.data).replace(/<.+?>/g,'');;
    let dictch=str.substr(offset,50);
    cursorword=dictch;
    let start=offset,end=offset;
    while (start>0 && !isSpace(str.charAt(start))) start--;
    if (isSpace(str.charAt(start))) start++;
    while (end<str.length && !isSpace(str.charAt(end))) end++;

    const word=str.substring(start,end);

    return {cursorword,word,offset,anchor:sel.anchorNode}
}