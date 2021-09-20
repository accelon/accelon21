<script>
import Icons from './icons';
export let onclick;
export let icon;
export let title='';
const svg=Icons[icon];
</script>
<span class="button" title={title} on:click={onclick} >{@html svg}</span>

<style>
    span.button{cursor:pointer;fill:silver}
    span.button:hover {border-bottom:white 1px solid}
</style>