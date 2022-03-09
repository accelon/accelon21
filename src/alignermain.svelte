<script>
import { onMount } from 'svelte';
import AlignerBar from './alignerbar.svelte';
import {editor} from './js/alignerstore'
import {AlignInstruction,beforeChange,changed, updateBlankLineCount,cursorActivity} from './js/aligner-edit.js'
import {decorateOfftag} from './js/aligner-decorate.js'
import {loadScript} from 'pitaka/utils'
let ready=false;

onMount( async()=>{
    await loadScript("codemirror.js",()=>typeof CodeMirror!=='undefined');
    ready=true;
})
const initCM=ele=>{
    const cm = CodeMirror(ele, {
        lineNumbers:true,
        lineWrapping:true,
        value:AlignInstruction,
        theme:'ambiance'
    }
    );
    cm.setSize('100%','95vh');
    cm.on("beforeChange",beforeChange);
    cm.on("change",changed);
    cm.on("cursorActivity",cursorActivity);
    updateBlankLineCount(cm);
    decorateOfftag(cm);
    $editor=cm;
}

</script>
<AlignerBar/>
<div style="height:100%">
    {#if ready}
    <div use:initCM></div>
    {/if}
</div>

<style>

</style>