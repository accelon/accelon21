import {get} from "svelte/store"
export const tofind=(ptk,item,idx,{tofind,tofindsim})=> {
    let match=false;
    const text=item.text|| ptk.getLine(item.key);
    let m= text.match(tofind) ;
    if (!m) {
        if (text.match(tofindsim)) match=true;
    } else match=true;
    return match;
}
export const bookmark=(ptk,item,idx,{bookmarks})=> {
    return get(bookmarks)[idx]==1;
}
export const bookmarksolid=(ptk,item,idx,{bookmarks})=> {
    return get(bookmarks)[idx]>1;
}
export const usernote=(ptk,item,idx,{usernotes})=> {
    return get(usernotes)[idx];
}
export default {tofind,bookmark,usernote,bookmarksolid};