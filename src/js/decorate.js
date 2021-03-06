import {OffTag} from 'pitaka/offtext';
import {diffCJK,trimPunc} from 'pitaka/utils';
import {parseHook, posPin} from 'pitaka/align';
import {fromSim, toSim } from 'lossless-simplified-chinese';
export const getLangstyle=(l,trans)=>'lang-'+l+(l==='pl'?'-'+(trans||''):'');
export const decoratePage=(ptk,linetext,{backlinks,q, y,hook,notes,hits})=>{
    const extra=[];
    if (!ptk || !linetext) return extra;
    if (backlinks && backlinks.length) { //convert backlink hook to tag
        const linksAt={};
        backlinks.forEach(bl=>{
            const [hstr,srcptr]=bl;
            const H=parseHook(hstr, linetext);
            const lkey=H.y+'_'+(H.x+H.w);
            if (!linksAt[lkey]) linksAt[lkey]=[];
            linksAt[lkey].push( [srcptr, H.y, H.x,H.w] );
        })
        for (let i in linksAt) {
            const links=linksAt[i];
            const [srcptr, y,x,w]=links[0];
            const srcptrs=links.map(i=>i[0]).join(';');
            extra.push( new OffTag('blnk',{'@':srcptrs,x,w}, y,x+w,0))
        }
    }
    if (hook) {
        extra.push( new OffTag('cite',{},0,hook.x,hook.w) );
        const D=diffCJK(trimPunc(q),linetext,hook.x,hook.w)
        let x=hook.x;
        D[0].forEach(d=>{
            if (d.added) {
                extra.push( new OffTag('ins',{}, 0,x, d.value.length)) ;
                x+=d.count;
            } else if (d.removed) {
                extra.push( new OffTag('del',{'t': d.value}, 0, x,1)) ;
                
            } else x+=d.count;
        })
    }
    /*
    if (linetofind) {
        const regex=new RegExp(linetofind,'ig');
        
        const iter=linetext.matchAll(regex);
        for (let i of iter) {
            extra.push(new OffTag('linetofind', {},0,i.index, i[0].length));
        }
        const regexsim=new RegExp(fromSim(linetofind),'ig');
        const itersim=linetext.matchAll(regexsim);
        for (let i of itersim) {
            extra.push(new OffTag('linetofind', {},0,i.index, i[0].length));
        }
    }
    */
    if (notes) {
        notes.forEach(note=>{
            let [pin,val,id]=note.split('\t');
            id=id||'???'
            const x=posPin(linetext,pin);
            const notetag=ptk.header.notesjson||'f';
            extra.push(new OffTag(notetag,{val,id}, 0, x,0))
        })
    }
    if (hits && hits.length) {
        hits.forEach(([x,w,nth=0])=>{
            extra.push(new OffTag('hl',{nth}, 0, x,w))
        })
    }
    extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);
    return extra;
}

export const getSeqColor=cnt=>cnt?'hsl('+((cnt+1)*60) +' ,50%,50%)':'silver';