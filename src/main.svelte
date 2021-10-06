<script>
import {column,activecolumn,targetcolumn,cols,tosim} from './js/store.js'
import PitakaViewer from './pitakaviewer.svelte'
import renderer from './js/renderer.js';
import Btn from './button.svelte';
import StateBtn from './statebutton.svelte';
let toindex=0,systemsetting=false;
let vs;
$: vs&&vs.scrollToIndex(toindex)
const setActiveColumn=n=>{
        if (isNaN(n)) $activecolumn++;
        else $activecolumn=parseInt(n);
        if ($activecolumn>$column) $activecolumn=0; 
}
const togglesystemsetting=()=>{
	systemsetting=!systemsetting;
}
const updateActiveColumn=()=>{
	if ($activecolumn>$column) $activecolumn=0; 
	$targetcolumn=$column?$column:0; 
}
$: col=$activecolumn;
</script>
<div class="main">
	<div class='container'>
		<div class="systemsetting">
			<Btn icon="setting" onclick={togglesystemsetting} />
			{#if systemsetting}
			<StateBtn states={{0:'column1',1:'column2',2:'column3'}}  onclick={updateActiveColumn}
		storeid={column} stylestore={cols} forceupdate={col}/>
		<StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
			{/if}
		</div>

		<div id="viewers">
			<div on:click={()=>setActiveColumn(0)} class="viewer"><PitakaViewer/></div>
			{#if $column>=1}
			<div on:click={()=>setActiveColumn(1)} class="viewer"><PitakaViewer col={1}/></div>
			{/if}
			{#if $column==2}
			<div on:click={()=>setActiveColumn(2)} class="viewer"><PitakaViewer col={2}/></div>
			{/if}
		</div>
	</div>
</div>
<style>
    #viewers {display:flex;flex-direction: row;}
    .viewer {width:100%}
	.container {
		min-height: 100px;
		height: calc(100vh - 2em);
	}
	.systemsetting {position:absolute;right:0px}
</style>