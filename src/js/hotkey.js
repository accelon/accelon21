import {addresses_a,addresses_b, addtab, gotab} from './addresses.js'
import {copyAddress,getCursorAddress} from './address.js'

window.onkeydown=evt=>{
    const code=evt.key.charCodeAt(0);
    if (evt.ctrlKey && code>=0x30&&code<=0x40) {
        evt.preventDefault()
    }
}

window.onkeyup=evt=>{
    const code=evt.key.charCodeAt(0);
    if (evt.ctrlKey)  {
        const addresses=(evt.altKey) ?addresses_a:addresses_b;
        if (code==0x30) addtab('/',addresses)
        if (code>=0x31&&code<=0x40) gotab(code-0x30-1,addresses);
        else if (evt.key.toLowerCase()==='x') {
            const addr=getCursorAddress();
            copyAddress(addr);
        }
    }
}
export default {};