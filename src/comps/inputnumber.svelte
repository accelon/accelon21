<script>
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
export let stepper=true;
export let style="width:2rem";
export let min=1;
export let value=min;
export let autofocus=false;
export let max=value>min?value:Number.MAX_SAFE_INTEGER;
const clamp=(num, min, max)=> num < min ? min : num > max ? max : num;
const oninput=(evt)=>{
    let val=parseInt(evt.target.value)||min;
    updateValue(val);
}  
const updateValue=val=>{
    val=parseInt(val);
    val=clamp(val,min,max) || min;
    if(value!==val) {
        value=val;
        dispatch('change',value);
    }
}
const valinc=evt=>value=value<max?updateValue(evt.ctrlKey?max:parseInt(value)+1):max;
const valdec=evt=>value=value>min?updateValue(evt.ctrlKey?min:parseInt(value)-1):min;
const keydown=evt=>{
    if (evt.key=="ArrowDown") valdec(evt);
    else if (evt.key=="ArrowUp") valinc(evt);
    else if (evt.key=="Enter")  dispatch('enter',value);
}
function setfocus(node){
    if(autofocus) node.focus();
}
</script>
<span class="numinput">
    {#if stepper}<span title="Ctrl ← min" class="stepper" class:disabled={value==min} on:click={valdec}>⏴</span>{/if}<input title="↑ ↓ Ctrl-↑  Ctrl-↓"  use:setfocus {style} on:keydown={keydown} on:input={oninput} {value}/>{#if stepper}<span title="Ctrl → max" class="stepper"  class:disabled={value==max} on:click={valinc}>⏵</span> {/if}
</span>
<style>
    .numinput{-webkit-user-select: none;}
    .stepper {cursor:pointer}
    .disabled {color:var(--button-unselected);cursor:default}
</style>