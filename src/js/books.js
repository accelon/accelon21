import {fromSim} from 'lossless-simplified-chinese';
import {bsearch} from 'pitaka/utils'
import {useBasket} from 'pitaka'
import {get} from 'svelte/store';
const findBooks=(ptk,str)=>{
    const bk=ptk.getLabel('bk');
    let nbookarr=[];
    const m=str.match(/([\da-zA-Z ,;]+)/);
    if (m && m[1].length===str.length) { //by book id
        nbookarr=str.split(/[ ,;]/).map( id=>bk.idarr.indexOf(id)).filter(id=>id>-1);
    } else {
        let res=bk.query(str);
        if (res.count==0 && fromSim(str)!==str) {
            res=bk.query( fromSim(str) )
        }
        nbookarr=res.matches.map(it=>it.at);
    }
    return nbookarr;
}

const bookitemsById=(bk,idarr)=>{
    const keynames=Object.keys(bk.keywords);
    const idmap={};
    let items=[];
    if (!idarr) {
        for (let i=0;i<bk.idarr.length;i++) {
            const id=bk.idarr[i];
            const keywords=keynames.map(k=> [k,bk.keywords[k][i]] );
            idmap[id]=i;
            items.push({key:i, id,text:bk.names[i], keywords });
        }
    } else {
        items=idarr.map((nbk,key)=>{
            const id=bk.idarr[nbk];
            const keywords=keynames.map(k=> [k,bk.keywords[k][nbk]] );
            idmap[id]=key;
            return {key, id,text:bk.names[nbk], keywords }
        });
    }
    return {items,idmap}    
}

export const buildBooklist=(addr,scoredLine, bookitems,excerptitems)=>{
    const ptk=useBasket(addr.basket);
    const bk=ptk.getLabel('bk');
    let nbookarr=null; //all books
    const keylabel=addr.kl, keyvalue=addr.kv;

    if (keylabel==='bk'){
        if (keyvalue) nbookarr=findBooks(ptk,keyvalue);
    } else if (keylabel) {
        const lbl=ptk.getLabel(keylabel);
        const res=lbl.query(keyvalue);
        if (res.count) {
            nbookarr= res.positions;
        } else {
            nbookarr=[]; //no book
        }
    }
    const {idmap,items}=bookitemsById(bk,nbookarr);
    nbookarr=idmap;
    bookitems.set(items);
    
    if (get(bookitems).length == 0) {
        excerptitems.set([]);    
    } else if (get(bookitems).length===bk.names.length) {
        const out=scoredLine.map(([y,score],key)=>{return {ptk,key, y,score}});
        excerptitems.set(out);
    } else {
        const out=scoredLine.filter( ([y])=>{
            //check if y in book list
            const at=bsearch(bk.linepos,y,true);
            return idmap.hasOwnProperty(bk.idarr[at-1]);
        }).map(([y,score],key)=>{return {ptk,key, y,score}});
        excerptitems.set(out);  
    }
}

export default {buildBooklist}