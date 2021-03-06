import {fromSim} from 'lossless-simplified-chinese';
import {bsearch,intersect} from 'pitaka/utils'
import {useBasket} from 'pitaka'
import {get,writable,derived} from 'svelte/store';
const findHeadings=(ptk,str)=>{
    const cl=ptk.getChunkLabel();
    let nchunks=[];
    const m=str.match(/([\da-zA-Z ,;]+)/);
    if (m && m[1].length===str.length) { //by book id
        nchunks=cl.idarr.map((id,idx)=>{
            if (id.indexOf(str)>-1) return idx;
            else return -1;
        }).filter(id=>id>-1)
    }
    if (!nchunks.length) {//try name
        let res=cl.query(str);
        if (res.count==0 && fromSim(str)!==str) {
            res=cl.query( fromSim(str) )
        }
        nchunks=res.matches.map(it=>it.at);
    }
    return nchunks;
}

const chunkitemsById=(ptk,cl,idarr)=>{
    const keynames=cl.keywords?Object.keys(cl.keywords):[];
    const idmap={};
    let items=[];
    if (!idarr) {
        let py=0;
        for (let i=0;i<cl.idarr.length;i++) {
            const id=cl.idarr[i];
            // const keywords=keynames.map(k=> [k,cl.keywords[k][i]||0 ] ).filter(it=>it[1]> -1);
            idmap[id]=i;
            const y0=cl.linepos[i];
            const text= (cl.names[i].trim()) ?cl.names[i]: ptk.headingOf(y0).text;
            if (py==y0) items.pop();//use the later item with in same line
            items.push(i);
            // items.push({key:i, y0,id,text, keywords });
            py=y0;
        }
    } else {
        const items=[];
        let py=0;
        for (let i=0;i<idarr.length;i++) {
            const ncl=idarr[i];
            const id=cl.idarr[ncl];
            const y0=cl.linepos[ncl];
            const keywords=keynames.map(k=> [k,cl.keywords[k][ncl]||0] ).filter(it=>it[1]> -1);
            idmap[id]=i;
            if (py==y0) items.pop();//use the later item with in same line
            const text=cl.names[ncl];
            if (text) items.push({key:i, y0,id,text, keywords })
            py=y0;
        }
    }
    const books={}
    items.forEach(it=>{
        const bk=ptk.bookOf(it);
        if (bk && !books[bk]) books[bk]=true;
    });
    return {items,idmap,books : Object.keys(books)}    
}


export const buildHeadingList=(addr,scoredLine, excerptitems ,headingStore)=>{
    const ptk=useBasket(addr.basket);
    const cl=ptk.getChunkLabel();
    let nchunks=null; //all chunk
    const keylabel=addr.kl, keyvalue=addr.kv;

    if (keylabel===ptk.header.chunk){
        if (keyvalue) {
            nchunks=findHeadings(ptk,keyvalue);
            headingStore.set(nchunks);
        }
    } else if (keylabel) {
        const lbl=ptk.getLabel(keylabel);
        const res=lbl.query(keyvalue);
        if (res.count) {
            nchunks= res.positions;
        } else {
            nchunks=[]; //no book
        }
    }
    const {idmap,items,books}=chunkitemsById(ptk,cl,nchunks);
    // nchunks=idmap;
    

    if (items.length == 0) {
        excerptitems.set([]);    
    } else if (items.length===cl.names.length) { //all books
        const out=scoredLine.map(([y,score],key)=>{
            const ncl=bsearch(cl.linepos,y,true)-1;
            return {ptk,key,ncl, y,score}
        });
        excerptitems.set(out);
    } else {
        const out=scoredLine.filter( ([y])=>{
            //check if y in book list
            const ncl=bsearch(cl.linepos,y,true)-1;
            const clname=cl.idarr[ncl];
            return idmap.hasOwnProperty(clname);
        }).map(([y,score],key)=>{
            const ncl=bsearch(cl.linepos,y,true)-1;
            return {ptk,key,ncl, y,score}
        });
        excerptitems.set(out);  
    }
    return books;
}

export const createFilterOptionStore=(ptk)=>{
    const filters=ptk.getHeadingFilters();
    const O={};
    for (let i=0;i<filters.length;i++) {
        const F=filters[i];
        const filterer=filtererOf(ptk,F)
        if (! O[filterer] ) {
            const {names}=ptk.getLabel(F.name);
            O[filterer] = writable({name:filterer,opts:[], res:names.length }); 
        }
    }
    return O;
}
export const filteredByOption=filterOptionStore=>{
    const stores=Object.values(filterOptionStore);
    // watching all filters, combine their result with intersection
    const filtered=derived( stores , Stores=>{
            const out=Stores.reduce((o,s,idx)=>{
                // console.log('options changed' ,s.name,s.res )
                if (idx==0) return s.res;
                const k=s.res.length?intersect(o,s.res):o;
                return k;
            },[]);
        return out;
    },[]);
    return filtered;
}
export const filtererOf=(ptk,F)=>{
    return (ptk.isDictionary()?'entry_':'heading_')+ptk.langOf();;
}

export default {buildHeadingList, createFilterOptionStore,filtererOf,filteredByOption}