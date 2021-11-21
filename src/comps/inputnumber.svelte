<script>
    import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
export let stepper=true;
export let value;
export let style="width:2rem";
export let min=0;
export let autofocus=false;
export let max=Number.MAX_SAFE_INTEGER;
const clamp=(num, min, max)=> num < min ? min : num > max ? max : num;
let val=parseInt(value);
$: val=clamp(parseInt(val),parseInt(min),parseInt(max))||0;
$: if(val!==value) {  value=val; dispatch('change',val);} 
const valinc=evt=>val=evt.ctrlKey?max:val+1;
const valdec=evt=>val=evt.ctrlKey?min:val-1;
const onkeyup=evt=>{
    if (evt.key=="ArrowDown") valinc(evt);
    if (evt.key=="ArrowUp") valdec(evt);
}
function setfocus(node){
    if(autofocus) node.focus();
}
</script>
<span class="numinput">
    {#if stepper}<span title="Ctrl ← min" class="stepper" class:disabled={val==min} on:click={valdec}>⏴</span>{/if}<input title="↑ ↓ Ctrl-↑  Ctrl-↓"  use:setfocus {style} on:keyup={onkeyup} bind:value={val}/>{#if stepper}<span title="Ctrl → max" class="stepper"  class:disabled={val==max} on:click={valinc}>⏵</span> {/if}
</span>
<style>
    .numinput{-webkit-user-select: none;}
    .stepper {cursor:pointer}
    .disabled {color:var(--button-unselected);cursor:default}
</style>