<script>
import {logs,files} from './store.js'
import {readContent} from 'pitaka/format';
import {escapeHTML} from 'pitaka/utils'
const read=async evt=>{
    const f=$files[parseInt(evt.target.dataset.idx)];
    const content=escapeHTML(await readContent(f));
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
