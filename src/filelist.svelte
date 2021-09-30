<script>
import {logs,files,config,fileidx,texttoc} from './store.js'
import {readPlainTextFile,readHaodooFile} from 'pitaka/format';
import {escapeHTML} from 'pitaka/utils'
import Btn from './button.svelte'

const read=async evt=>{
    const idx=parseInt(evt.target.dataset.idx);
    $fileidx=idx;
    const f=$files[idx];
    let lines,toc;
    if (f.zip) {
        lines=await f.zip.files[f.name].async('string').split(/\?\r?\n/);
    } else {
        if (f.name.endsWith('.updb')) {
            const haodoo=await readHaodooFile(f);
            lines=haodoo.lines;
            $texttoc=haodoo.toc;
        } else {
            lines=escapeHTML(await readPlainTextFile(f)).split(/\?\r?\n/);
        }
    }
    
    $logs=lines.map((text,idx)=>{return {ukey:idx,text }});
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
