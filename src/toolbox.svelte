<script>
import {chromefs} from 'pitaka/platform'
import {tab} from './store.js';
import FilesTab from './filestab.svelte'
import ExtractTab from './extracttab.svelte'
import MetaTab from './metatab.svelte'
import LogsTab from './logstab.svelte'
import BuildTab from './buildtab.svelte'
import TabBtn from './tabbutton.svelte';
</script>
{#if !chromefs.ready}
<div class="error">Need Chrome version 86 or above</div>
{:else}
<div id="toolbox">
  <div id="leftpanel">
      <div class="tabs">    
        <TabBtn icon="files" title="源文件 source files"/>
        <TabBtn icon="meta" title="数据库设置 database meta"/>
        <TabBtn icon="build" title="建置 build"/>
        <TabBtn icon="validate" title="标记检验 markup validation"/>
        <TabBtn icon="extract" title="抽取特征 extract pattern"/>
        <TabBtn icon="help" title="说明 instruction"/>
      </div>
      <div class="tab-content" class:visible={$tab=='tab-files'}><FilesTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-meta'}><MetaTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-validate'}>validate</div>
      <div class="tab-content" class:visible={$tab=='tab-extract'}><ExtractTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-build'}><BuildTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-help'}>Help</div>
  </div>
  <div id="rightpanel"><LogsTab/></div>
</div>
{/if}

<style>
#toolbox {height: 100vh;width:100vw;display:flex;flex-direction: row;}
#leftpanel {width:30vw;height:100vh;overflow:hidden}
#rightpanel {width:70vw;height:100vh;overflow:auto}
.error {color:red}

.tabs {-webkit-user-select: none;}
.tab-content {
		position: absolute;
    height:90vh;
    width:30vw;
		/* !important; */
		opacity: 0;
		pointer-events: none;
		overflow:hidden;
	}
.tab-content.visible {/* can't use visibility due to a weird painting bug in Chrome */
  opacity: 1;
  pointer-events: all;
}


</style>