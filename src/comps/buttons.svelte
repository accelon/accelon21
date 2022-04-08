<script>
import Checkbox from './checkbox.svelte';
export let type='';
export let br=false;
export let onoff=false;
export let allon=false;
export let items=[];
export let values=[];
const buttontype={'checkbox':Checkbox}[type];

const toggle=name=>{
    if (values.includes(name)) {
        values.splice(values.indexOf(name),1);
    } else {
        values.push(name);
    }
    values[name]=values[name];
}
const allonoff=()=>{
    if (values.length) values=[]   
    else values=items.map(it=>it.name);
}
if (!values.length) allonoff(); //turn on all
</script>
{#each items as item}
<svelte:component this={buttontype} 
label={item.label} onClick={oldv=>toggle(item.name,oldv)}
        value={values.includes(item.name)}/>
{#if br}<br/>{/if}
{/each}
{#if onoff}
<span class="onoff clickable" on:click={allonoff}> {values.length?"☐":"☑"} </span>
{/if}

<style>
    .onoff {float:right}
</style>