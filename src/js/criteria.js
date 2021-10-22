export const matchCriteria=(items,criteria)=>{
    if (!items || !criteria || Object.keys(criteria).length==0)  return items;

    return items.filter(item=>{
        if (!item.keywords)return true;
        let match=0;
        for (let i=0;i<item.keywords.length;i++){
            const [lbl,value]=item.keywords[i];
            if (criteria.hasOwnProperty(lbl)){
                if (criteria[lbl]==value || !criteria[lbl]) match++;
            }
        }
        return !!match;
    })
}