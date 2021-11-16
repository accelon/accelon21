<script>
import TabSelector from './tabselector.svelte';
import PitakaList from './pitakalist.svelte'
import SearchBar from './searchbar.svelte';
import {selectorShown} from './js/addresses.js'

</script>

<div class="container">
<div class="controlbar">
    <span on:click={()=>$selectorShown=!$selectorShown}>Accelon 2021</span>
    <TabSelector/><SearchBar/></div>
<div><PitakaList/></div>
</div>