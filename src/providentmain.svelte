<script>
import ProvidentBar from './providentbar.svelte'
import VirtualScroll from './3rdparty/virtualscroll'
import {vscrollitems,filecontent,toiast,activeline} from './js/providentstore.js';
import {toIASTOffText} from 'provident-pali'
let vscroll;
const setactiveline=l=>{
    activeline.set(parseInt(l));
}
$:  vscroll&& ((Math.abs(vscroll.getTopIndex()-$activeline))>50)? vscroll.scrollToIndex( $activeline,true):0;
</script>
<div class="container">
<ProvidentBar/>
    <VirtualScroll bind:this={vscroll} keeps={50} 
     height="calc(100% - 1.5em)" data={$vscrollitems}  key="key" let:data >

        <div on:click={()=>setactiveline(data.key)} class={$toiast?"iast":"provident"} class:isactive={$activeline==data.key} >{$toiast?toIASTOffText(data.text):data.text}</div>
    </VirtualScroll>
</div>
<style>
    .isactive {background: rgb(32,32,32)}
    :global(.container) {overflow:hidden;height:100vh}
</style>