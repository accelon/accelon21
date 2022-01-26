<script>
import SplitPane from './3rdparty/splitpane.svelte';
import Btn from './comps/button.svelte';
import Settings from './settings.svelte'
import {addresses_a,addresses_b} from './js/addresses.js'
import {panepos,systemsetting} from './js/store.js';
import PitakaViews from './pitakaviews.svelte';
import SelectionMenu from './selectionmenu.svelte';
import { debounce,detectOrientation } from 'pitaka/utils';
let type=detectOrientation();

window.onresize=debounce(()=>type=detectOrientation(),500);
const togglesystemsetting=()=>{
	systemsetting.set($systemsetting);
}
</script>
<div class="container">
<div class="systemsetting" ><Btn title="设置 setting" icon="setting" 
    onclick={togglesystemsetting} store={systemsetting}/>
</div>
<SelectionMenu/>
<SplitPane bind:type bind:pos={$panepos} min={15} max={85}>
    <div slot="a">
        <PitakaViews addresses={addresses_a} side={0}/>
    </div>
    <div  slot="b">
        <div class:hide={$systemsetting}>
        <PitakaViews addresses={addresses_b} side={1} />
        </div>

        {#if $systemsetting}
        <Settings/>
        {/if}
    </div>
</SplitPane>
</div>
<style>
    .hide {display:none;}
    .container {height:100vh}
    /* strange right:0px doesn't work*/
	.systemsetting {position:absolute;z-index: 9999;top:0px;right:7%}
</style>