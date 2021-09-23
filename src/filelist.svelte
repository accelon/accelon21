<script>
import {logs,files,config,fileidx} from './store.js'
import {readPlainTextFile,readHaodooFile} from 'pitaka/format';
import {escapeHTML} from 'pitaka/utils'
import Btn from './button.svelte'

const read=async evt=>{
    const idx=parseInt(evt.target.dataset.idx);
    $fileidx=idx;
    const f=$files[idx];
    let content;
    if (f.zip) {
        content=await f.zip.files[f.name].async('string');
    } else {
        if (f.name.endsWith('.updb')) {
            content=await readHaodooFile(f);
        } else {
            content=escapeHTML(await readPlainTextFile(f));
        }
    }
    
    $logs=content.split(/\r?\n/);
}
const exportable=fn=>{
    return fn.endsWith('.updb');
}
const exporttotxt=()=>{

}
</script>
<div>
    {#each $files as file,idx}
    <div class:selected={$fileidx==idx} class:source={$config.files.indexOf(file.name)>-1}
         class="filename" on:click={read} data-idx={idx}>{file.name}
        </div>

    {/each}
</div>
<style>
    .selected {border-left: 3px solid var(--highlight);}
    .source:after {content:'✔'}
    .filename {font-size:0.8rem;font-family: Consolas, monospace; cursor:pointer}
    .filename:hover{color:limegreen}
</style>
