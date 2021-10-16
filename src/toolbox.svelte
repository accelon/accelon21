<script>
import {chromefs} from 'pitaka/platform'
import {toolbox_panepos,tab,errormsg} from './js/store_toolbox.js';
import FilesTab from './filestab.svelte'
import ExtractTab from './extracttab.svelte'
import DatabaseTab from './databasetab.svelte'
import PlainTextView from './plaintextview.svelte'
import LogView from './logview.svelte'
import BuildTab from './buildtab.svelte'
import TabBtn from './radiobutton.svelte';
import SplitPane from './3rdparty/splitpane.svelte';
const rightpanels = {
  'files' : PlainTextView,
}
let type='horizontal';

$: rightpanel = rightpanels[$tab] || LogView ; console.log(rightpanel)

window.onresize=()=>{
  setTimeout(()=>{
    if (mm('(min-width: 769px)') || mm('(orientation:landscape)')) type='horizontal';
    else type='vertical'
  })
}

</script>



{#if !chromefs.ready}
<div class="errormsg">Need Chrome version 86 or above</div>
{:else}
<SplitPane bind:pos={$toolbox_panepos} bind:type>
    <div slot="a" id="leftpanel">
      <div class="tabs">    
        <TabBtn store={tab} icon="files" title="源文件 source files"/>
        <TabBtn store={tab} icon="build" title="建置 build"/>
        <TabBtn store={tab} icon="database" title="数据库 database"/>
        <TabBtn store={tab} icon="extract" title="抽取特征 extract pattern"/>
        <TabBtn store={tab} icon="help" title="说明 instruction"/>
        <span class="errormsg">{$errormsg}</span>
      </div>

      <div class="tab-content" class:visible={$tab=='files'}><FilesTab/></div>
      <div class="tab-content" class:visible={$tab=='database'}><DatabaseTab/></div>
      <div class="tab-content" class:visible={$tab=='extract'}><ExtractTab/></div>
      <div class="tab-content" class:visible={$tab=='build'}><BuildTab/></div>
      <div class="tab-content" class:visible={$tab=='help'}>Help</div>
    </div>

    <div slot="b" id="rightpanel">
      <div id="rightpanel"><svelte:component this={rightpanel} /></div>
    </div>


</SplitPane>

{/if}

<style>
#toolbox {height: 100vh;width:100vw;display:flex;flex-direction: row;}
#leftpanel {overflow:hidden}
.tabs {overflow:hidden}
#rightpanel {overflow:hidden}
.errormsg {color:red}

.tabs {-webkit-user-select: none; background:var(--panel-background)}
.tab-content {
		position: absolute;
    height:90vh;
    /* width:30vw; */
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