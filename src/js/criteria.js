import { fromSim } from 'lossless-simplified-chinese';
import renderer_collapse from  '../render_collapse.svelte'
export const matchTofind=(ptk,items,tf,filteron)=>{
    if (!items||!ptk||!tf || !filteron)return items||[];

    const out=[];
    tf=tf.trim();
    let regex,ngap=0,prev=0,sim;
    try {
        regex=new RegExp(tf);
        sim=new RegExp(fromSim(tf),'ig');
    } catch(e) {
        console.error(e);
        return [];
    }
    const y0=items[0].key;
    for (let i=0;i<items.length;i++){
        let match=false;
        const item=items[i];
        const text=item.text|| ptk.getLine(item.key);
        let m= text.match(regex) ;
        if (!m) {
            if (text.match(sim)) match=true;
        } else match=true;

        if (match) {
            if (i-prev>1) {
                out.push({text:' ', key:'g'+prev+'-'+i,y0,from:prev,to:i,renderer:renderer_collapse})
                ngap++;
            }
            out.push(item);
            prev=i+1;
        }
    }
    const lastkey=items[items.length-1].key - y0;
    out.push({text:' ',key:'g'+prev+'-'+lastkey,y0,from:prev,to:lastkey,renderer:renderer_collapse});
    out.push({text:'--',key:'end'})
    return out;
}
export const matchCriteria=(items,criteria,tf)=>{
    if (!items || ((!criteria || Object.keys(criteria).length==0) && !tf))  return items;

    const sim=fromSim(tf);
    const nocriteria=(Object.values(criteria).filter(it=>!!it).length==0);
    return items.filter(item=>{
        if (!item.keywords)return true;
        let match=0;
        if (tf) {
            let at= item.text.indexOf(tf) ;
            if (at==-1) { //try simplified version
                if (item.text.indexOf(sim)==-1) return false;
                else return true;
            }
            return true;
        }
        if (nocriteria) return true;
        for (let i=0;i<item.keywords.length;i++){
            const [lbl,value]=item.keywords[i];
            if (criteria.hasOwnProperty(lbl)){
                if (criteria[lbl]==value || !criteria[lbl]) match++;
            }
        }
        return !!match;
    })
}