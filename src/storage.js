const APP_PREFIX='ACC21_';
export const getItem=(key,cb)=>{
    const v=localStorage.getItem(APP_PREFIX+key);
    cb&&cb(v);
}

export const setItem=(key,v,cb)=>{
    localStorage.setItem(APP_PREFIX+key,v);
    cb&& cb();
}