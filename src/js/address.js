import {writable ,get} from "svelte/store";
import {serializePointer} from 'pitaka/offtext'
export const copiedAddress = writable('');
export const copyAddress=(str)=>{
    copiedAddress.set(str);
}

export const cursorAddress = writable({ptk:null,loc:'',sel:'',y:0,x:0,hook:''});

export const getCursorAddress=()=>{
    const a=get(cursorAddress);
    if (!a.loc)return;
    return serializePointer(a.ptk,a.y,a.hook);
}

