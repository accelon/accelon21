export const getUserData=(ptkname,loc='')=>{
    const out={};
    for (let key in localStorage) {
        const prefix=ptkname+'.'+loc+'.';
        if (key.startsWith(prefix)) {
            out[key.substr(prefix.length)]=JSON.parse(localStorage.getItem(key));
        }
    }
    return out;
}
export const setUserData=(ptkname,loc,data)=>{
    if (!ptkname||!loc)return;
    const key=ptkname+'.'+loc+'.';
    const oldata=localStorage.getItem(key);
    const newdata=JSON.stringify(data);
    if (oldata!==newdata) localStorage.setItem( key, newdata);
}