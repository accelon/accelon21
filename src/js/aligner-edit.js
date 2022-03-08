import { alignbkid, alignloc,blanklinecount,aligntop } from "./alignerstore.js";
import { linePN, makeLocalAddress } from "pitaka/offtext";
import {get} from "svelte/store"
import {addresses_a,settab} from "./addresses.js"
import {parseAddress ,stringifyAddress} from 'pitaka/offtext';

const locOfLine=(cm,line)=>{
    let nline=line;
    while (nline>0 && !linePN(cm.getLine(nline))) {
        nline--;
    }
    const pn=linePN(cm.getLine(nline));
    return makeLocalAddress(get(alignbkid),pn[1], line-nline);
}
const syncOpposite=(cm,loc)=>{
    const addresses=get(addresses_a);
    if (!addresses.length) return;
    const addr=parseAddress(addresses[0].address);
    const newaddr=parseAddress(addr.basket+':'+loc);
    addr.loc=newaddr.loc;
    addr.dy=newaddr.dy;
    const newaddress=stringifyAddress(addr);
    settab(0,newaddress);
    const {top}=cm.cursorCoords(cm.getCursor(),'page');
    aligntop.set(top);
}
export const cursorActivity=cm=>{
    const {line,ch}=cm.getCursor();
    const loc=locOfLine(cm,line);
    alignloc.set(loc);
    syncOpposite(cm,loc);
}
export const beforeChange=(cm,change)=>{
    let touched=false;
    cm.operation(()=>{
        const line=cm.getLine(change.from.line);
        if (change.origin=="setValue") touched=true;
        else if (change.origin=="+input") {
            if (change.from.line==change.to.line) {
                if (change.text.length==2 && change.text[0]==""&&change.from.ch==change.to.ch) {
                    if (!change.from.ch || line[change.from.ch]!=='^') {
                        const bl=paraBlankLine(cm,change.to.line);
                        if (bl>change.to.line) {
                            deleteLine(cm,bl-1, {line:change.to.line+1,ch:0});
                            touched=true;                    
                        }
                    }
                } else if (change.text[0]=='\n') { //add blank line
                    touched=true;
                } else if (change.text[0]==' ') {
                    goBreakable(cm,change.to);
                }
            } else if (change.text.length==1) {
                if (change.text[0]=='' && change.to.line==change.from.line+1) { //delete a line
                touched=true;
                }
            } 
        } else if (change.origin=="+delete"){
            if (change.text.length==1 &&change.text[0]=="" &&change.from.line+1==change.to.line
            &&cm.getLine(change.from.line).length==change.from.ch&&change.to.ch==0 ) {
                const next=nextPN(cm,change.from.line);
                touched=true; //join line
                console.log('start')
                // cm.startOperation();
                insertBlankLine(cm,next, change.from);
            } 
        }
        if(!touched && change.cancel) change.cancel();
    })


}
export const updateBlankLineCount=doc=>{
    let count=0;
    for (let i=0;i<doc.lineCount();i++) {
        if (!doc.getLine(i)) count++;
    }
    blanklinecount.set(count);
}
export const paraBlankLine=(cm,line)=>{
    for (let i=line+1;i<cm.lineCount();i++) {
        if (!cm.getLine(i)) return i;
        if (linePN(cm.getLine(i))) break;
    }
    return -1;
}
export const goBreakable=(cm,cursor)=>{
    let {line,ch}=cursor;
    let linetext=cm.getLine(line);
    if (ch==linetext.length && line<cm.lastLine()) {
        line++;
        linetext=cm.getLine(line);
        ch=0;
    }
    const t=linetext.substr(ch);
    const m=t.match(/[。；？：！\.\!\?]/);
    if (m) ch+=m.index+1;
    setTimeout(()=>{
        cm.setCursor({line,ch})
    });
}
export const deleteLine=(cm,line,cursor)=>{
    cm.off("beforeChange",beforeChange );
    cm.doc.replaceRange('',{line:line+2,ch:0},{line:line+1,ch:0});// 
    cm.on("beforeChange",beforeChange);
    cm.setCursor(cursor);
}
export const insertBlankLine=(cm,line,cursor)=>{
    cm.off("beforeChange",beforeChange);
    cm.doc.replaceRange('\n',{line:line,ch:0},{line:line,ch:0});// 
    cm.on("beforeChange",beforeChange);
    cm.setCursor(cursor);
}

export const nextPN=(cm,line)=>{
    for (let i=line+1;i<cm.lineCount();i++) {
        if (linePN(cm.getLine(i))) return i;
    }
    return cm.lineCount();
}
export const changed=(doc,changeobj)=>{
    updateBlankLineCount(doc)
}
export const testdata=`^z1[一　梵網經]^z2[第一　誦品]^z3[稱讚如來]^bk#dn1[長部1]^ck#d1^n1如是我聞。一時，世尊^f2與五百大比丘僧伽，由王舍城往那爛陀村，同行於大道。
一遊行者須卑亦與其弟子梵施童子，由王舍城往那爛陀村，同行於大道。
途中，遊行者須卑，以種種方法誹謗佛陀、誹謗佛法、誹謗僧伽。
反之，其弟子梵施童子，以種種方法稱讚佛陀、稱讚佛法、稱讚僧伽。如是其所說正相反之師徒二人，緊隨世尊與比丘僧伽之後而行。


^n2時，世尊於菴婆羅樹園內國王〔所建〕之休息堂，與比丘僧伽同宿一夜；
遊行者須卑，亦於菴婆羅樹園內國王之休息堂，與弟子梵施童子同宿一夜。
於此，遊行者須卑，又以種種方法誹謗佛陀、誹謗佛法、誹謗僧伽；反之，其弟子梵施童子，又以種種方法稱讚佛陀、稱讚佛法、稱讚僧伽。
如是其所說正相反之師徒二人，隨世尊及比丘僧伽之後而住^f3。

^n3時，其夜方曉，眾多之比丘起而集坐於講堂，生起如次之話題：
「友！希有哉！友！未曾有哉！已知已見之阿羅漢、等正覺者、世尊，徹見眾生〔心〕之種種趣向。
然，遊行者須卑，以種種方法誹謗佛陀、誹謗佛法、誹謗僧伽；
反之，其弟子梵施童子，卻以種種方法稱讚佛陀、稱讚佛法、稱讚僧伽。
如是其所說正相反之師徒二人，緊隨世尊及比丘僧伽之後而行。」`