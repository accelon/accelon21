import {fromSim} from 'lossless-simplified-chinese';
import {bsearch} from 'pitaka/utils'
import {useBasket} from 'pitaka'
import {get} from 'svelte/store';
const findClusters=(ptk,str)=>{
    const cl=ptk.getClusterLabel();
    let nclusters=[];
    const m=str.match(/([\da-zA-Z ,;]+)/);
    if (m && m[1].length===str.length) { //by book id
        nclusters=cl.idarr.map((id,idx)=>{
            if (id.indexOf(str)>-1) return idx;
            else return -1;
        }).filter(id=>id>-1)
    }
    if (!nclusters.length) {//try name
        let res=cl.query(str);
        if (res.count==0 && fromSim(str)!==str) {
            res=cl.query( fromSim(str) )
        }
        nclusters=res.matches.map(it=>it.at);
    }
    return nclusters;
}

const clusteritemsById=(cl,idarr)=>{
    const keynames=cl.keywords?Object.keys(cl.keywords):[];
    const idmap={};
    let items=[];
    if (!idarr) {
        for (let i=0;i<cl.idarr.length;i++) {
            const id=cl.idarr[i];
            const keywords=keynames.map(k=> [k,cl.keywords[k][i]||0 ] ).filter(it=>it[1]> -1);
            idmap[id]=i;
            const y0=cl.linepos[i];
            if (cl.names[i].trim()) items.push({key:i, y0,id,text:cl.names[i], keywords });
        }
    } else {
        items=idarr.map((ncl,key)=>{
            const id=cl.idarr[ncl];
            const y0=cl.linepos[ncl];
            const keywords=keynames.map(k=> [k,cl.keywords[k][ncl]||0] ).filter(it=>it[1]> -1);
            idmap[id]=key;
            return {key, y0,id,text:cl.names[ncl], keywords }
        }).filter(it=>!!it.text.trim());
    }
    return {items,idmap}    
}

export const buildClusterlist=(addr,scoredLine, clusteritems,excerptitems)=>{
    const ptk=useBasket(addr.basket);
    const cl=ptk.getClusterLabel();
    let nclusters=null; //all cluster
    const keylabel=addr.kl, keyvalue=addr.kv;

    if (keylabel===ptk.header.cluster){
        if (keyvalue) nclusters=findClusters(ptk,keyvalue);
    } else if (keylabel) {
        const lbl=ptk.getLabel(keylabel);
        const res=lbl.query(keyvalue);
        if (res.count) {
            nclusters= res.positions;
        } else {
            nclusters=[]; //no book
        }
    }
    const {idmap,items}=clusteritemsById(cl,nclusters);

    nclusters=idmap;
    clusteritems.set(items);
    
    if (get(clusteritems).length == 0) {
        excerptitems.set([]);    
    } else if (get(clusteritems).length===cl.names.length) { //all books
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
}

export default {buildClusterlist}