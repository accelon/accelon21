import {updateSettings,settings} from './savestore.js'
import { derived, writable } from "svelte/store";

export const toolbox_panepos=writable(settings.toolbox_panepos||30);
export const files=writable([]);
export const logs=writable([]);
export const srcfilename=writable('');
export const srcfilelines=writable([]); //lines of current selected src file
export const tofind=writable('');

export const tab=writable(settings.tab);
export const errormsg=writable('');
export const summarize=writable(true);
export const ignorecase=writable(false);
export const playing=writable(false);
export const playingfile=writable(-1);
export const sourcezip=writable(null);//source files in a single zip file (contain pitaka.json)

export const cachestorage=writable(true);  //存入 browser cacheStorage
export const exportpitaka=writable(false); //自動匯出 ptk (若saveptkhandle 為null ，call saveFilePicker)
export const saveptkhandle=writable(null); //建置中的存檔的handle, 從cacheStorage 匯出其他資料庫不修改此handle

export const config=writable({});

export const fileidx=writable(null);
export const texttoc=writable({});

export const txtashtml=writable(true);

const filterlines=([_lines,_tofind])=>{
    if (_tofind.trim()) {
        const keywords=_tofind.trim().split(/ +/).filter(i=>!!i.trim());
        //only support AND operation
        return _lines.filter( ({text})=> keywords.reduce( (r,key)=>r && text.includes(key),true));
    } return _lines;
}
export const tosim=writable(settings.tosim);

export const srcexcerpts=derived([srcfilelines,tofind],filterlines)

tosim.subscribe(tosim=>updateSettings({tosim}));
tab.subscribe(tab=>updateSettings({tab}));
toolbox_panepos.subscribe(toolbox_panepos=>updateSettings({toolbox_panepos}));