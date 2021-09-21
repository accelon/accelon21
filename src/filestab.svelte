<script>
import {chromefs,readTextFile} from 'pitaka/platform'
import Btn from './button.svelte';
import {files,tab,errormsg,config} from './store.js';
import Filelist from './filelist.svelte'

const addfiles=async()=>{
    const handles=await showOpenFilePicker(chromefs.openFileOption);
    $errormsg='';
    const configs=handles.filter(f=>f.name.endsWith('.json'));
    if (handles.length>0 && configs.length) {
        $files=handles;
        $config=JSON.parse(await readTextFile(configs[0]) );
        $tab='tab-build';
    } else {
        $errormsg='missing json file';
    }
}
</script>
<div id="filestab">
    <div id="controls">
        <Btn icon="addfiles" onclick={addfiles} title="选取源文件 select source files"/>
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
