<script>
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
export let stepper=true;
export let value;
export let style="width:2rem";
export let min=1;
export let autofocus=false;
export let max=value>min?value:Number.MAX_SAFE_INTEGER;
const clamp=(num, min, max)=> num < min ? min : num > max ? max : num;
const oninput=(evt)=>{
    let val=parseInt(evt.target.value)||0;
    val=clamp(val,min,max);
    updateValue(val);
}  
const updateValue=val=>{
    if(value!==val) {  
        value=val; dispatch('change',val);
    }
}
const valinc=evt=>value=updateValue(evt.ctrlKey?max:value+1);
const valdec=evt=>value=updateValue(evt.ctrlKey?min:value-1);
const onkeyup=evt=>{
    if (evt.key=="ArrowDown") valinc(evt);
    if (evt.key=="ArrowUp") valdec(evt);
}
function setfocus(node){
    if(autofocus) node.focus();
}
</script>
<span class="numinput">
    {#if stepper}<span title="Ctrl ← min" class="stepper" class:disabled={value==min} on:click={valdec}>⏴</span>{/if}<input title="↑ ↓ Ctrl-↑  Ctrl-↓"  use:setfocus {style} on:keyup={onkeyup} on:input={oninput} {value}/>{#if stepper}<span title="Ctrl → max" class="stepper"  class:disabled={value==max} on:click={valinc}>⏵</span> {/if}
</span>
<style>
    .numinput{-webkit-user-select: none;}
    .stepper {cursor:pointer}
    .disabled {color:var(--button-unselected);cursor:default}
</style>