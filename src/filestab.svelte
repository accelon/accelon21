<script>
import {chromefs,readTextFile} from 'pitaka/platform'
import Btn from './button.svelte';
import {files,tab,fileidx,errormsg,config} from './store.js';
import Filelist from './filelist.svelte'
import {validateConfig} from 'pitaka/basket';
import {JSZip} from 'lazip';
let msg='',zipfilename='';

const loadConfig=(json,inputFilenames)=>{
    let configjson={};
    try{
        configjson=JSON.parse(json);
    } catch(e) {
        $errormsg=e;
        return;
    }
     
    //config.files should be found in inputFilenames
    const err=validateConfig(configjson,inputFilenames); 
    if (!err) {
        $config=configjson;
        // $tab='tab-build';
        return true;
    } else {
        $config={};
        $errormsg=err;
    }
}
const addsourcefiles=async()=>{
    const handles=await showOpenFilePicker(chromefs.openFileOption);
    const configs=handles.filter(f=>f.name.endsWith('.json'));
    $errormsg='',msg='',zipfilename='';
    $files=[];
    if (handles.length>0 && configs.length) {
        const pickedFilenames=Array.from(handles).map(f=>f.name);
        if (!loadConfig(await readTextFile(configs[0]), pickedFilenames)) return;
        $files=handles;
        msg=handles.length+' files';
    } else {
        $errormsg='missing json file';
    }
}

const addsourcezip=async ()=>{
    const handles=await showOpenFilePicker(chromefs.openOneZipFileOption);
    $errormsg='',msg='',zipfilename='';
    $files=[];
    if (handles&&handles.length==1) {
        const jszip=new JSZip();
        const zip=await jszip.loadAsync(handles[0].getFile());
        const srcfiles=[];
        const zipsrcfiles=Object.keys(zip.files);
        for (let f in zip.files){
            if (f.endsWith('.json')) {//single zip file should contain pitaka.json
                const json=(await zip.file(f).async('string')).trim();//trim BOM
                if (!loadConfig(json, zipsrcfiles)) break;
            }
            srcfiles.push({name:f, zip});
        }
        if ($config.name) {
            $files=srcfiles; //config is loaded successfully
            zipfilename=handles[0].name;
        }
    }
}
const exportable=()=>{
    if ($files.length&&$fileidx<$files.length) {
        return $files[$fileidx].name.endsWith('.updb')
    }
}
const exporttotxt=()=>{

}
</script>
<div id="filestab">
    <div id="controls">
        <Btn icon="addsourcefiles" onclick={addsourcefiles} title="选取多个源文件 pick source files"/>
        {msg}
        <Btn icon="addsourcezip" onclick={addsourcezip} title="选取压縮源文件 pick source zip"/>
        {zipfilename}

        {#key $fileidx}
        {#if exportable( )}
        <Btn icon='exporttotxt' onclick={exporttotxt}/>
        {/if}
        {/key}
    </div>
    <div id="filelist">
        <Filelist/>
    </div>
</div>
<style>
    #controls {width:100%}
    #filelist {overflow-y: auto;height:calc(90vh - 2em)}
    #filestab { padding-left:0.5em;}
</style>
