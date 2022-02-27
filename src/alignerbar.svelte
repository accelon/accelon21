<script>
import {get} from 'svelte/store'
import {editor,editinghandle,blanklinecount} from './js/alignerstore.js'
let savetime='';
const openfile=async ()=>{
    const [fileHandle]=await showOpenFilePicker();
    const file = await fileHandle.getFile();
    const content=await file.text();
    get(editor).setValue(content);
    editinghandle.set(fileHandle);
}
const savefile=async ()=>{
    let handle=get(editinghandle);
    await handle.requestPermission({mode : 'readwrite'});
    const writable = await handle.createWritable();
    const content=get(editor).getValue();
    await writable.write( content );
    await writable.close();
    savetime='d at '+(new Date()).toLocaleTimeString();
}
const nextgap=()=>{
    const cm=get(editor);
    const {line}=cm.getCursor();
    for (let i=line+1;i<cm.lineCount();i++) {
        if (!cm.getLine(i)) {
            cm.setCursor({line:i})
            break;
        }
    }
    cm.focus();
}

</script>
<button on:click={openfile}>open</button>
{#if $editinghandle}
<button on:click={savefile}>save{savetime}</button>
{/if}
<button on:click={nextgap}>Gap {$blanklinecount}</button>
