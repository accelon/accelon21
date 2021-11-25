import {fromSim} from 'lossless-simplified-chinese';
import {bsearch} from 'pitaka/utils'
export const findBooks=(ptk,str)=>{
    const bk=ptk.getLabel('bk');
    let bookidarr=[];
    const m=str.match(/([\da-zA-Z ,;]+)/);
    if (m && m[1].length===str.length) { //by book id
        bookidarr=str.split(/[ ,;]/).map( id=>bk.idarr.indexOf(id)).filter(id=>id>-1);
    } else {
        let res=bk.query(str);
        if (res.count==0 && fromSim(str)!==str) {
            res=bk.query( fromSim(str) )
        }
        bookidarr=res.matches.map(it=>it.at);
    }
    const keynames=Object.keys(bk.keywords);
    return bookidarr.map((nbk,key)=>{
        const id=bk.idarr[nbk];
        const keywords=keynames.map(k=> [k,bk.keywords[k][nbk]] ).filter(it=>!!it[1]);
        return {key, id,text:bk.names[nbk], keywords}
    })
}

export default {findBooks}