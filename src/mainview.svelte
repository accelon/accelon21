<script>
import SplitPane from './3rdparty/splitpane.svelte';
import PitakaViewer from './pitakaviewer.svelte'
import ControlBar from './controlbar.svelte'
</script>
<div class="container">
<SplitPane type='vertical' pos={50} min={30} max={90}>
    <div class="pane" slot="a">
        <div class="fixed-menu">xxx</div>
        <PitakaViewer/>
    </div>
    <div class="pane" slot="b">
        <div class="fixed-menu">yyyy</div>
        <PitakaViewer/>
    </div>
</SplitPane>
</div>
<style>
	.fixed-menu {
        right:1em;
		height:30px;
		overflow-y: clip;
		background:rgba(0,0,0,0.5);
		border-radius: 5px;
		position:fixed;
		/* z-index: 999; */
	}
    .container {height:100vh}
    .pane {width:100%;}
</style>