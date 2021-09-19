<script>
import {chromefs} from 'pitaka/platform'
import Btn from './button.svelte';
import {files} from './store.js';
import Filelist from './filelist.svelte'
const openfile=async()=>{
    const handles=await showOpenFilePicker(chromefs.openFileOption);
    $files=handles;
}

</script>
<div id="filestab">

    <div id="controls">
        <Btn icon="addfiles" onclick={openfile} title="选取源文件 select source files"/>
        {$files.length} files    
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
