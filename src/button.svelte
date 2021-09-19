<script>
import Icons from './icons';
export let onclick;
export let icon;
export let title='';
const svg=Icons[icon];
</script>
<span class="button" title={title} on:click={onclick} >{@html svg}</span>

<style>
    span.button{cursor:pointer}
    span.button:hover {fill:brown}
</style>