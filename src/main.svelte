<script>
import {loadaddress} from './js/addresshash.js';
import _R from './js/renderer.js'; //make sure renderer is loaded
import _F from './js/filterer.js';
import _L from './js/labeler.js'; //maker sure labeler is loaded
import HotKey from './js/hotkey.js';
import MainView from './mainview.svelte';
import LoadingAnimation from './comps/loading.svelte'
import {_,tosim} from './js/store.js'
import { onMount } from 'svelte';
import { openBasket } from 'pitaka';
let started=false;
let PitakaStatus=[];

onMount(async ()=>{
	PitakaStatus=loadaddress().map(basket=>[basket,null]);
	for (let i=0;i<PitakaStatus.length;i++){
        const ptk=await openBasket(PitakaStatus[i][0]);
        PitakaStatus[i][1]=ptk;
		PitakaStatus=PitakaStatus;//refresh
    }
	started=true;
});
</script>
<div class="container">

{#if !started}
	<div class='loadingstatus'>
	{#each PitakaStatus as ptk,idx (idx)}
		<div class='pitaka'>
		{#if ptk[1]}
		<span class='title'>{_(ptk[1].header.title,$tosim)}</span>
		<!-- <span class='loadtime'>{JSON.stringify(ptk[1].loadtime)}ms</span> -->
		{:else}
		<LoadingAnimation/>{ptk[0]}
		{/if}
		</div>
	{/each}
	</div>
{:else if started}
	<MainView/>
{/if}
</div>

<style>
.loadingstatus {margin-top:1em;margin-left:1em}
.container {
	min-height: 100px;
	height: 100vh;
}
</style>