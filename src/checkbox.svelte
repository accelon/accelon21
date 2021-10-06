<script>
import Icons from './asset/icons';
import store from './js/store.js';
export let label='';
export let id;
export let title='';
export let icon='';
export let beforeChecked=null;
const svg=Icons[icon]||'';
const storeid=store[id];
export let disabled=false;
const toggle=async evt=>{
    if (disabled) return;
    if (!$storeid && beforeChecked) {
        if (await beforeChecked(evt)) $storeid = true;
    } else{
        $storeid = ! $storeid; //normal toggle
    }
}
</script>
<span class="button" title={title} class:yes={$storeid} 
class:disabled on:click={toggle}>{@html svg}{label}</span>

<style>
    .button{cursor: pointer;padding-right:5px}
    .button:before{content:'☐'}
    .button:hover{color:var(--button-highlight-color);stroke:var(--svg-highlight-stroke-color)}
    .yes:before {content:'☑';color:var(--checkbox-checked-color)}

    .disabled {color:silver;text-decoration: line-through;}
    .disabled:before{content:'☐';color:silver}
</style>