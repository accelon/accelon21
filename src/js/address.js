import {writable ,get} from "svelte/store";
import {stringifyAddress} from 'pitaka/offtext'
export const copiedAddress = writable('');
export const copyAddress=(str)=>{
    copiedAddress.set(str);
}

export const cursorAddress = writable({ptk:null,loc:'',sel:'',y:0,x:0,hook:'',side:0});

export const getCursorAddress=()=>{
    const a=get(cursorAddress);
    if (!a.loc)return;
    // console.log('side tab',a.side,a.tabid)
    const loc=a.ptk.locOf(a.y);
    return stringifyAddress({ptk:a.ptk,loc,hook:a.hook});
}

