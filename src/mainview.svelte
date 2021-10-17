<script>
import SplitPane from './3rdparty/splitpane.svelte';
import Btn from './button.svelte';
import StateBtn from './statebutton.svelte';

import {panepos,tosim} from './js/store.js';
import PitakaViews from './pitakaviews.svelte';
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
        <div class="systemsetting">
            <Btn icon="setting" onclick={togglesystemsetting} />
            {#if systemsetting}
        <StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
            {/if}
        </div>
    </div>
    <div  slot="b">
        <PitakaViews/>
    </div>
</SplitPane>
</div>
<style>

    .container {height:100vh}
	.systemsetting {position:absolute;right:0px}
</style>