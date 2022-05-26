<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import {picked} from './js/store.js'
import InputNumber from './comps/inputnumber.svelte';
/* todo , use comps/hamburgermenu  */
export let ptk=null;
export let scrollStart=0;
$: ptk;
</script>
<Hamburgermenu {scrollStart}>
<!-- <svelte:component this={$searchbox[ptk.format]||$searchbox.toc} {ptk}/> -->
</Hamburgermenu>
