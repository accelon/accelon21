<script>
import SplitPane from './3rdparty/splitpane.svelte';
import Btn from './button.svelte';
import StateBtn from './statebutton.svelte';
import PitakaViewer from './pitakaviewer.svelte'
import {panepos,tosim} from './js/store.js';
import { debounce,detectOrientation } from 'pitaka/utils';
let type=detectOrientation();
let systemsetting=false;

window.onresize=debounce(()=>type=detectOrientation(),500);

const togglesystemsetting=()=>{
	systemsetting=!systemsetting;
}
</script>
<div class="container">
<SplitPane bind:type bind:pos={$panepos} min={15} max={85}>
    <div slot="a">
        <div class="fixed-menu-a"  >AAA</div>
        <PitakaViewer/>
    </div>
    <div  slot="b">
        <div class="fixed-menu-b">
            <div class="systemsetting">
                <Btn icon="setting" onclick={togglesystemsetting} />
                {#if systemsetting}
            <StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
                {/if}
            </div>

        </div>
        <PitakaViewer/>
    </div>
</SplitPane>
</div>
<style>
	.fixed-menu-a {
		height:30px;
        /* width:100%; */
		overflow-y: clip;
		background:rgba(0,0,0,0.5);
		border-radius: 5px;
		position:fixed;
		z-index: 999;
	}
	.fixed-menu-b {
        right:0;
		height:30px;
        /* width:100%; */
		overflow-y: clip;
		background:rgba(0,0,0,0.5);
		border-radius: 5px;
		position:fixed;
		z-index: 999;
	}
    .container {height:100vh}
	.systemsetting {position:absolute;right:0px}
</style>