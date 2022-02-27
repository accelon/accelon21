<script>
import { onMount } from 'svelte';
import AlignerBar from './alignerbar.svelte';
import {editor} from './js/alignerstore'
import {testdata,beforeChange,changed, updateBlankLineCount} from './js/aligner-edit.js'
import {decorateOfftag} from './js/aligner-decorate.js'
import {loadScript} from 'pitaka/utils'
let cursorword='',ready=false;

onMount( async()=>{
    await loadScript("codemirror.js",()=>typeof CodeMirror!=='undefined');
    ready=true;
})
const initCM=ele=>{
    const cm = CodeMirror(ele, {
        lineNumbers:true,
        lineWrapping:true,
        value:testdata,
        theme:'ambiance'
    }
    );
    cm.setSize('50vw','100vh');
    cm.on("beforeChange",beforeChange);
    cm.on("change",changed);
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