<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import {useBasket} from 'pitaka'
import Checkbox from './comps/checkbox.svelte';
export let ptk;
export let scrollStart=0;
import {getContext} from 'svelte'
const alignedPitaka=ptk.aligned.map(n=>useBasket(n));
const bkstore=getContext('bkstore');

for (let basket of ptk.aligned) {
    if (!$bkstore.aligned.hasOwnProperty(basket)) {
        $bkstore.aligned[basket]=false;
    }
}

</script>
<Hamburgermenu {scrollStart}>
    <div slot='aligned'>
        {#each alignedPitaka as ptk}
        <Checkbox label={ptk.header.title} bind:value={$bkstore.aligned[ptk.name]}/><br/>
        {/each}
    </div>
</Hamburgermenu>