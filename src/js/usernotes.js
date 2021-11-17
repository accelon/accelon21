const NOTEPREFIX ='ACC21NOTE.';
import {PATHSEP, useBasket} from 'pitaka'
export const getUserNotes=(ptk,loc)=>{
    const notes=localStorage.getItem(NOTEPREFIX+ptk.name+PATHSEP+loc)||'{}';
    try{
        const obj=JSON.parse(notes);
        for (let key in obj) {
            obj[key]=obj[key].filter(it=>!!it)
        }
        return obj;
    } catch(e) {
        return {};
    }
}
const setUserNotes=(ptk,loc,notes)=>{
    localStorage.setItem(NOTEPREFIX+ptk.name+PATHSEP+loc,JSON.stringify(notes));
}
export const saveNote=({ptk,y,loc,hook,text,marker,br},op='')=>{
    if (typeof ptk==='string') ptk=useBasket(ptk);
    const [from]=ptk.getPageRange(loc);
    const delta=y-from;
    const notes=getUserNotes(ptk,loc);
    const linenotes=notes[delta]||[];

    let updated=false;

    for (let i=0;i<linenotes.length;i++) {
        if (linenotes[i].hook==hook) {
            if (op==='remove' || op==='add') {
                linenotes.splice(i,1); 
            } else {
                linenotes[i].text=text||'';
                linenotes[i].marker=marker||1;
                linenotes[i].br=br||false;
            }
            updated=true;
            break;
        }
    }
    if (op==='add') {
        linenotes.push({hook,text,marker,br});  
        notes[delta]=linenotes;
        updated=true;
    }

    if (updated) {
        if (!linenotes.length) delete notes[delta];
        setUserNotes(ptk,loc,notes);
    }
}
