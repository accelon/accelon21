<script>
import {chromefs,readTextFile} from 'pitaka/platform'
import Btn from './button.svelte';
import {files,tab,errormsg,config} from './store.js';
import Filelist from './filelist.svelte'
import {validateConfig} from 'pitaka/basket';
import {JSZip} from 'lazip';
const loadConfig=(json,pickedFilenames)=>{
    const configjson=JSON.parse(json);
    const err=validateConfig(configjson,pickedFilenames);
    if (!err) {
        $config=configjson;
        $tab='tab-build';
        return true;
    } else {
        $config={};
        $errormsg=configs[0].name+' error:'+err;
    }
}
const addsourcefiles=async()=>{
    const handles=await showOpenFilePicker(chromefs.openFileOption);
    const configs=handles.filter(f=>f.name.endsWith('.json'));
    $errormsg='';
    $files=[];
    if (handles.length>0 && configs.length) {
        const pickedFilenames=Array.from(handles).map(f=>f.name);
        if (!loadConfig(await readTextFile(configs[0]), pickedFilenames)) return;
        $files=handles;
    } else {
        $errormsg='missing json file';
        // $file become zip 
    }
}
//single zip file should contain pitaka.json
const addsourcezip=async ()=>{
    const handles=await showOpenFilePicker(chromefs.openOneZipFileOption);
    $errormsg='';
    $files=[];
    if (handles&&handles.length==1) {
        const jszip=new JSZip();
        const zip=await jszip.loadAsync(handles[0].getFile());
        const zipfiles=[];
        const zipsrcfiles=Object.keys(zip.files);
        for (let f in zip.files){
            if (f.endsWith('.json')) {
                const json=(await zip.file(f).async('string')).trim();//trim BOM
                if (!loadConfig(json, zipsrcfiles)) return;
            } else {
                zipfiles.push({name:f, zip});
            }
        }
        $files=zipfiles;
    }
}
</script>
<div id="filestab">
    <div id="controls">
        <Btn icon="addsourcefiles" onclick={addsourcefiles} title="选取源文件 select source files"/>
        <Btn icon="addsourcezip" onclick={addsourcezip} title="选取源文件 select source zip"/>
        <span id="filecount">{$files.length} </span>files
    </div>
    <div id="filelist">
        <Filelist/>
    </div>
</div>
<style>
    #controls {width:100%}
    #filelist {overflow-y: auto;height:calc(90vh - 2em)}
    #filestab { padding-left:0.5em;}
    #filecount {color:peachpuff}
</style>
