<script>
import {chromefs} from 'pitaka/platform'
import {tab,errormsg} from './store.js';
import FilesTab from './filestab.svelte'
import ExtractTab from './extracttab.svelte'
import DatabaseTab from './databasetab.svelte'
import PlainTextView from './plaintextview.svelte'
import LogView from './logview.svelte'
import BuildTab from './buildtab.svelte'
import TabBtn from './tabbutton.svelte';

const rightpanels = {
  'tab-files' : PlainTextView,
}

$: rightpanel = rightpanels[$tab] || LogView ; console.log(rightpanel)
</script>

{#if !chromefs.ready}
<div class="errormsg">Need Chrome version 86 or above</div>
{:else}
<div id="toolbox">
  <div id="leftpanel">
      <div class="tabs">    
        <TabBtn icon="files" title="源文件 source files"/>
        <TabBtn icon="build" title="建置 build"/>
        <TabBtn icon="database" title="数据库 database"/>
        <TabBtn icon="validate" title="标记检验 markup validation"/>
        <TabBtn icon="extract" title="抽取特征 extract pattern"/>
        <TabBtn icon="help" title="说明 instruction"/>
        <span class="errormsg">{$errormsg}</span>
      </div>
      <div class="tab-content" class:visible={$tab=='tab-files'}><FilesTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-database'}><DatabaseTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-validate'}>validate</div>
      <div class="tab-content" class:visible={$tab=='tab-extract'}><ExtractTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-build'}><BuildTab/></div>
      <div class="tab-content" class:visible={$tab=='tab-help'}>Help</div>
  </div>
  <div id="rightpanel"><svelte:component this={rightpanel} /></div>
</div>
{/if}

<style>
#toolbox {height: 100vh;width:100vw;display:flex;flex-direction: row;}
#leftpanel {width:30vw;height:100vh;overflow:hidden}
#rightpanel {width:70vw;height:100vh;overflow:hidden}
.errormsg {color:red}

.tabs {-webkit-user-select: none; background:var(--panel-background)}
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