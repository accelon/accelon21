<script>
import {get} from 'svelte/store'
import {editor,editinghandle,blanklinecount,alignbkid,alignloc} from './js/alignerstore.js'
import Btn from './comps/button.svelte'
let savetime='',errormsg='';

const parseAligningText=content=>{
    const m=content.match(/\^bk([#a-z\d]+)/);
    let bkid=null;
    if (m) {
        bkid=m[1];
        if (bkid[0]=='#') bkid=bkid.substring(1)
    }
    return {bkid};
} 
const openfile=async ()=>{
    const [fileHandle]=await showOpenFilePicker();
    const file = await fileHandle.getFile();
    const content=await file.text();
    const {bkid}=parseAligningText(content);
    if (!bkid) {
        errormsg='missing ^bk markup';
    } else {
        alignbkid.set(bkid);
        errormsg=''
        editinghandle.set(fileHandle);
        get(editor).setValue(content);
    }
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
<span class='spacing'/>
<Btn onclick={openfile} icon="openfile"/>
{#if $editinghandle}
{$editinghandle.name}
<span class='spacing'/>
<Btn onclick={savefile} icon="save"/>{savetime}
{/if}
{#if $blanklinecount}
<span class='spacing'/>
<Btn onclick={nextgap} icon="crlf" caption={$blanklinecount} />
{/if}
{$alignloc}
<span class='err'>{errormsg}</span>
<style>
    .err {color:red}
    .spacing{padding:0.5em}
</style>