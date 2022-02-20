<script>
import Icons from './icons.js';
export let label='';
export let title='';
export let icon='';
export let store=null;
export let beforeChecked=null;
const svg=Icons[icon]||'';
export let disabled=false;

//use without store
// export let onClick=null;
// export let checked=false; //always false if store is given
export let value=false;

const toggle=async evt=>{
    if (disabled) return;
    if (!store) {
        value=!value;
    } else {
        value=false;
        if (!$store && beforeChecked) {
            if (await beforeChecked(evt)) $store = true;
        } else{
            $store = ! $store; //normal toggle
        }
    }
}
</script>
<span class="button" title={title} class:yes={ (store&&$store) || value} 
class:disabled on:click={toggle}>{@html svg}{label}</span>

<style>
    .button{cursor: pointer;padding-right:5px;fill:var(--button-selected);}
    .button:before{content:'☐'}
    .button:hover{color:var(--button-highlight-color);stroke:var(--svg-highlight-stroke-color)}
    .yes:before {content:'☑';color:var(--checkbox-checked-color)}

    .disabled {color:silver;text-decoration: line-through;}
    .disabled:before{content:'☐';color:silver}
</style>