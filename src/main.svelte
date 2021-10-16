<script>
import {tosim,panepos} from './js/store.js'
import PitakaViewer from './pitakaviewer.svelte'
import R from './js/renderer.js'; //make sure renderer is loaded
import L from './js/labeler.js'; //maker sure labeler is loaded
import MainView from './mainview.svelte';
import SplitPane from './3rdparty/splitpane.svelte';
import Btn from './button.svelte';
import StateBtn from './statebutton.svelte';
let toindex=0,systemsetting=false;
let vs;
$: vs&&vs.scrollToIndex(toindex)
const togglesystemsetting=()=>{
	systemsetting=!systemsetting;
}

</script>
<div class="container">
	<SplitPane bind:pos={$panepos} min={15} max={85} type='horizontal'>
		<div slot="a">
			<div class="systemsetting">
			<Btn icon="setting" onclick={togglesystemsetting} />
			{#if systemsetting}
		<StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
			{/if}
		</div>
		</div>
		<div slot="b">
			<MainView/>
		</div>
	
	</SplitPane>
</div>
<style>

	.container {
		min-height: 100px;
		height: 100vh;
	}
	.systemsetting {position:absolute;right:0px}
</style>