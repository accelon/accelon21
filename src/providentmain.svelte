<script>
import ProvidentBar from './providentbar.svelte'
import VirtualScroll from './3rdparty/virtualscroll'
import {getCursorWord} from './js/selection.js'
import {vscrollitems,filecontent,toiast,activeline,cursorword,tofind} from './js/providentstore.js';
import {toIASTOffText,toIAST} from 'provident-pali'
let vscroll;
const setactiveline=l=>{
    activeline.set(parseInt(l));
    const w=getCursorWord();
    cursorword.set(w.word||'');
}
$:  vscroll&&!$tofind&& ((Math.abs(vscroll.getTopIndex()-$activeline))>50)? vscroll.scrollToIndex( $activeline):0;
const displaytext=(text,toiast,tofind)=>{
    text=toiast?toIASTOffText(text):text;

    if (tofind) {
        tofind=toiast?toIAST(tofind).replace('??',''):tofind;
        try {
            const reg=new RegExp('('+tofind+')','g');
            text=text.replace(reg,"<span class=hl>$1</span>")
        } catch(e) {

        }
    }

    return text;
}
</script>
<div class="container">
<ProvidentBar/>
    <VirtualScroll bind:this={vscroll} keeps={50} 
     height="calc(100% - 1.5em)" data={$vscrollitems}  key="key" let:data >

        <div on:click={()=>setactiveline(data.key)} class={$toiast?"iast":"provident"} class:isactive={$activeline==data.key} >{@html displaytext(data.text,$toiast,$tofind)}</div>
    </VirtualScroll>
</div>
<style>
    .isactive {background: rgb(32,32,32)}
    :global(.container) {overflow:hidden;height:100vh}

    :global(.hl) {color: lightgreen}
</style>