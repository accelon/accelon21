<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import sb from './js/searchbox.js';
import {searchbox,picked} from './js/store.js'
import InputNumber from './comps/inputnumber.svelte';
/* todo , use comps/hamburgermenu  */
export let ptk=null;
export let scrollStart=0;
$: showmode=$picked.word?2:1;
$: ptk;
</script>
<Hamburgermenu {scrollStart} {showmode}>
<!-- <svelte:component this={$searchbox[ptk.format]||$searchbox.toc} {ptk}/> -->
</Hamburgermenu>
