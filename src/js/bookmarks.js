const BOOKMARKPREFIX ='ACC21BM.';
import {PATHSEP} from 'pitaka'
export const getBookmarks=(ptk,loc)=>{
    const bookmarks=localStorage.getItem(BOOKMARKPREFIX+ptk.name+PATHSEP+ptk.pageLoc(loc))||'{}';
    try{
        return JSON.parse(bookmarks);
    } catch(e) {
        return {};
    }
}

export const saveBookmarks=(ptk,loc,bookmarks)=>{
    const key=BOOKMARKPREFIX+ptk.name+PATHSEP+ptk.pageLoc(loc);
    for (let i in bookmarks) {
        if (!bookmarks[i]) delete bookmarks[i];
    }
    if (Object.keys(bookmarks).length==0) bookmarks=null;
    if (bookmarks) localStorage.setItem(key,JSON.stringify(bookmarks));
    else localStorage.removeItem(key);
}

