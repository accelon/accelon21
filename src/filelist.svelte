<script>
import {files} from './store.js'
</script>
<div>
    {#each $files as file}
    <div class="filename">{file.name}</div>
    {/each}
</div>
<style>
    .filename {font-size:0.8rem;font-family: Consolas, monospace;}
</style>
