<script>
import BacklinkGroup from './backlinkgroups.svelte';
export let text='';
export let backlinkCount={};
export let ptk='';

</script>
<div><span class="tocitem">{text}</span>
<BacklinkGroup counts={backlinkCount} />
</div>

<style>
    .tocitem {cursor:pointer}
    .tocitem:hover{color:var(--highlight)}
</style>