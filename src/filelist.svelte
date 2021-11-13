<script>
import {srcfilename,srcfilelines,files,config,fileidx,texttoc} from './js/store_toolbox.js'
import {readFormatFile} from 'pitaka/format';

const read=async evt=>{
    const idx=parseInt(evt.target.dataset.idx);
    $fileidx=idx;
    const f=$files[idx];
    let lines;
    if (f.zip) {
        lines=(await f.zip.files[f.name].async('string')).split(/\?\r?\n/);
    } else {
        const out=await readFormatFile(f,$config.format);
        lines=out.rawtext;
        if (out.toclines) $texttoc=out.toclines;
    }
    $srcfilename=f.name;
    $srcfilelines=lines.map((text,idx)=>{return {ukey:idx,text }});
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
