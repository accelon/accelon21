<script>
import {chromefs} from 'pitaka/platform'
import Btn from './button.svelte';
import {files} from './store.js';
import Filelist from './filelist.svelte'

import LaZip from 'lazip';
// import JSZip from 'pitaka/jszip';

const openfile=async()=>{
    const handles=await showOpenFilePicker(chromefs.openFileOption);
    $files=handles;
}
let zipcontent='';
/*
this.centralDirSize
451682
this.centralDirOffset
5769129
*/
const openlazip=async()=>{
    // const url='T.zip';
    const url='CBETA.zip'
    console.time('open');
    const zip = await LaZip(url);    //lazy jszip
    console.timeEnd('open');

    console.time('read1')
    // let content=await zip.readTextFile("T01/T01n0001_002.xml");
    console.timeEnd('read1')

    console.time('read2')
    // content=await zip.readTextFile("T01/T01n0001_002.xml");
    console.timeEnd('read2')
    // console.log(zip)
    const content=await zip.readTextFile("advance_nav.xhtml"); //first file
   
    console.log( content.substr(0,100) );
}
const openzip=async()=>{ //read entire zip
    const url='CBETA.zip';
    fetch(url)       // 1) fetch the url
    .then(function (response) {                       // 2) filter on 200 OK
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })
    .then(LaZip.loadAsync)                            // 3) chain with the zip promise
    .then(function (zip) {
        return zip.file("advance_nav.xhtml").async("string"); // 4) chain with the text content promise
    }).then(data=>{
        console.log(data.substr(0,100))
    })
}

</script>
<div id="filestab">
    {zipcontent}
    <button on:click={openlazip}>lazip</button>
    <button on:click={openzip}>jszip</button>
    <div id="controls">
        <Btn icon="addfiles" onclick={openfile} title="选取源文件 select source files"/>
        <span id="filecount">{$files.length} </span>files
    </div>

    <div id="filelist">
        <Filelist/>
    </div>
   
</div>
<style>
    #controls {width:100%}
    #filelist {overflow-y: auto;height:calc(90vh - 2em)}
    #filestab { padding-left:0.5em;}
    #filecount {color:peachpuff}
</style>
