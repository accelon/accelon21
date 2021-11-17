<script>
import {loadaddress} from './js/addresshash.js';
import R from './js/renderer.js'; //make sure renderer is loaded
import L from './js/labeler.js'; //maker sure labeler is loaded
import HotKey from './js/hotkey.js';
import MainView from './mainview.svelte';
import LoadingAnimation from './comps/loading.svelte'

import { onMount } from 'svelte';
import { useBasket } from 'pitaka';
let started=false;
let loading=true;
let countdown=0;
let PitakaStatus=[];
onMount(async ()=>{
	await loadaddress( (loadingPitaka,config)=>{
		PitakaStatus=[];
		let loaded=0;
		for (let basket of loadingPitaka) {
			const ptk=useBasket(basket)
			PitakaStatus.push( [basket, ptk]);
			if (ptk) loaded++;
		}
		loading=(loadingPitaka.length>loaded)
		if (!loading) {
			countdown=parseInt(config.countdown)||9;
			if (countdown<=0) started=true;
			else {
				let timer=setInterval(()=>{
					countdown--;
					if (countdown<1) {
						started=true;
						clearInterval(timer);
					}
				},1000)
			}
		}
	});
});
</script>
<div class="container">

{#if !started}
	<div class='loadingstatus'>
	{#each PitakaStatus as ptk,idx (idx)}
		<div class='pitaka'>
		{#if ptk[1]}
		<span class='title'>{ptk[1].header.title} </span>
		<span class='loadtime'>{ptk[1].loadtime}ms</span>
		<span class='description'>{ptk[1].header.description||''}
		:{ptk[1].header.lastTextLine} build:{ptk[1].header.buildtime}
		</span>
		{:else}
		<LoadingAnimation/>{ptk[0]}
		{/if}
		</div>
	{/each}
	{#if !loading} <span class="startbutton" on:click={()=>countdown=0}>START {countdown}</span>{/if}
	</div>
{:else if started}
	<MainView/>
{/if}
</div>

<style>
.loadingstatus {margin-top:1em;margin-left:1em;font-size:150%;}
.container {
	min-height: 100px;
	height: 100vh;
}
</style>