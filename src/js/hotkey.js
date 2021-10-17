import {gotab} from './store.js'
window.onkeydown=evt=>{
    const code=evt.key.charCodeAt(0);
    if (evt.ctrlKey && code>=0x30&&code<=0x40) {
        evt.preventDefault()
    }
}

window.onkeyup=evt=>{
    const code=evt.key.charCodeAt(0);
    if (evt.ctrlKey && code>=0x30&&code<=0x40) {
        gotab(code-0x30)
    }
}
export default {};