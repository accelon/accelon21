const AppPrefix='ACC21.'
export const loadSettings=()=>{
    const tosim=parseInt(localStorage.getItem(AppPrefix+'tosim')||'0');
    const column=localStorage.getItem(AppPrefix+'column')||0;
    const tab=localStorage.getItem(AppPrefix+'tab')||'files';
    const vs0=JSON.parse(localStorage.getItem(AppPrefix+'vs0'))||{name:'openlit',loc:'6/14',hook:''};
    const vs1=JSON.parse(localStorage.getItem(AppPrefix+'vs1'))||{name:'gycd',loc:'',hook:''};
    const vs2=JSON.parse(localStorage.getItem(AppPrefix+'vs2'))||{};
    return {tosim,column,tab,vs0,vs1,vs2};
}

export const saveSettings=()=>{ //immediate save
    for (let key in settingsToBeSave) {
        localStorage.setItem(key, settingsToBeSave[key]);
        delete settingsToBeSave[key]
    }
    clearTimeout(updateTimer);
    console.log('settings autosaved on',new Date())
}
let updateTimer=0;
const settingsToBeSave={};
export const updateSettings=_settings=>{
    let updated=false,oldval;
    for (let key in _settings) {
        if (_settings.hasOwnProperty(key) ) {
            if (settings[key]!==_settings[key]) {
                let val=_settings[key];
                if (typeof val=='object') {
                    val=JSON.stringify(_settings[key]);
                    oldval=JSON.stringify(settings[key]);
                }
                if (val!==oldval) {
                    settingsToBeSave[AppPrefix+key]=val;
                    if (typeof _settings[key]=='object') {
                        settings[key]=JSON.parse(JSON.stringify(_settings[key]));
                    } else {
                        settings[key]=_settings[key];
                    }
                    updated=true;
                }    
            }
        }
    }
    if (updated) {
        clearTimeout(updateTimer);
        updateTimer=setTimeout(saveSettings,5000); //autosave in 5 seconds
    }
}

export const settings=loadSettings();
