import {AppPrefix} from './savestore'
import {useBasket} from 'pitaka'
export const getUserNotes=(ptk,loc)=>{
    const notes=localStorage.getItem(AppPrefix+ptk.name+'/'+loc)||'{}';
    try{
        const obj=JSON.parse(notes);
        for (let key in obj) {
            obj[key]=obj[key].filter(it=>!!it)
        }
        return obj;
    } catch(e) {
        return {};
    }
    /*
    if (ptk.name==='cb-t' && '1509/43') {
        return {
            {
            "6":[{"hook":"菩/蜜", "text":"個人筆記","marker":1}],
            "7":[{"hook":"須/提", "text":"xyz","marker":2}],
            "8":[{"hook":"羼/蜜", "text":"123","marker":3}]}
        }
    }
    */
    return {};
}
const setUserNotes=(ptk,loc,notes)=>{
    localStorage.setItem(AppPrefix+ptk.name+'/'+loc,JSON.stringify(notes));
}
export const updateNote=({ptk,y,loc,note},op='')=>{
    if (typeof ptk==='string') ptk=useBasket(ptk);
    const {hook,text,marker} = note;
    const [from]=ptk.getPageRange(loc);
    const delta=y-from;
    const notes=getUserNotes(ptk,loc);
    const locnote=notes[delta]||[];

    let updated=false;
    for (let i=0;i<locnote.length;i++) {
        if (locnote[i].hook==hook) {
            if (op==='remove') {
                locnote.splice(i,1);
            } else if (op==='add'){

                
            } else {
                locnote[i].text=text;
                locnote[i].marker=marker;
            }
            updated=true;
            break;
        }
    }
    if (updated) {
        if (!locnote.length) delete notes[delta];
        setUserNotes(ptk,loc,notes);
    }
}
