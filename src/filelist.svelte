<script>
import {logs,files} from './store.js'
import {readPlainTextFile,readHaodooFile} from 'pitaka/format';
import {escapeHTML} from 'pitaka/utils'
const read=async evt=>{
    const f=$files[parseInt(evt.target.dataset.idx)];
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
</script>
<div>
    {#each $files as file,idx}
    <div class="filename" on:click={read} data-idx={idx}>{file.name}</div>
    {/each}
</div>
<style>

    .filename {font-size:0.8rem;font-family: Consolas, monospace; cursor:pointer}
    .filename:hover{color:limegreen}
</style>
