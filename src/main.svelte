<script>
import {loadconfig} from './js/loadconfig';
import R from './js/renderer.js'; //make sure renderer is loaded
import L from './js/labeler.js'; //maker sure labeler is loaded
import HotKey from './js/hotkey.js';
import MainView from './mainview.svelte';
import { onMount } from 'svelte';
let ready=false;
onMount(()=>{
	loadconfig(()=>ready=true)
});
</script>
{#if !ready}
Loading Data...
{:else}
<div class="container">
	<MainView/>
</div>
{/if}
<style>
	.container {
		min-height: 100px;
		height: 100vh;
	}

</style>