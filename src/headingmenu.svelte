<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import {useBasket} from 'pitaka'
import Checkbox from './comps/checkbox.svelte';
export let ptk;
export let scrollStart=0;
import {getContext} from 'svelte'
const alignedPitaka=(ptk.aligned && ptk.aligned.map(n=>useBasket(n)))||[];
const bkstore=getContext('bkstore');

const toggle=(name)=>{
    const aligned=$bkstore.aligned;
    if (aligned.includes(name)) {
        aligned.splice(aligned.indexOf(name),1);
    } else {
        aligned.push(name);
    }
    $bkstore.aligned[name]=aligned[name];
}
</script>
<Hamburgermenu {scrollStart}>
    <div slot='aligned'>
        {#each alignedPitaka as ptk}
        <Checkbox label={ptk.header.title} onClick={oldv=>toggle(ptk.name,oldv)}
                value={$bkstore.aligned.includes(ptk.name)}/>
        <br/>
        {/each}
    </div>
</Hamburgermenu>