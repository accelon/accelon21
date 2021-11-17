import {copyAddress,getCursorAddress} from './address.js'
window.onkeydown=evt=>{
    if (!evt || !evt.key) return;
    const code=evt.key.charCodeAt(0);
    if (evt.ctrlKey && code>=0x30&&code<=0x40) {
        evt.preventDefault()
    }
}

window.onkeyup=evt=>{
    if (!evt || !evt.key) return;
    if (evt.ctrlKey)  {
        if (evt.key.toLowerCase()==='x') {
            const addr=getCursorAddress();
            copyAddress(addr);
        }
    }
}
export default {};