<script>
import {logs} from './store.js'

</script>
<div>
    {#each $logs as log,index (index)}
        <div>{@html log}</div>
    {/each}
</div>