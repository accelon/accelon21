<script>
import SplitPane from './3rdparty/splitpane.svelte';
import Btn from './comps/button.svelte';
import Settings from './settings.svelte'
import {addresses_a,addresses_b,ntab_a,ntab_b} from './js/addresses.js'
import {panepos,tosim,systemsetting} from './js/store.js';
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
<SelectionMenu/>
<SplitPane bind:type bind:pos={$panepos} min={15} max={85}>
    <div slot="a">
        <PitakaViews addresses={addresses_a} ntab={ntab_a} side={0}/>
    </div>
    <div  slot="b">
        <PitakaViews addresses={addresses_b} ntab={ntab_b} side={1} hide={$systemsetting}/>
        <div class="systemsetting">
            <Btn title="设置 setting" icon="setting" 
            onclick={togglesystemsetting} store={systemsetting}/>
        </div>
        {#if $systemsetting}
        <Settings/>
        {/if}
    </div>
</SplitPane>
</div>
<style>

    .container {height:100vh}
	.systemsetting {position:absolute;right:0px}
</style>