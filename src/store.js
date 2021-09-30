import { writable } from "svelte/store";
import items from "./data.js";
export const listitems=writable(items);
export const files=writable([]);
export const logs=writable([]);
export const tab=writable('tab-files');
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
export default {playing, files,tab,summarize,ignorecase,
    cachestorage,exportpitaka,saveptkhandle,fileidx}