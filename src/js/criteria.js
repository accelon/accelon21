import { fromSim } from 'lossless-simplified-chinese';

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