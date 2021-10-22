<script>
    import CheckBox from './checkbox.svelte';
    import Btn from './comps/button.svelte';
    import {extractregex} from './js/fileworkers.js'
    import {playing,files, summarize,logs, ignorecase} from  './js/store_toolbox.js'
    import FilterFileList from './filterfilelist.svelte'
    import { tick } from 'svelte';

    let invalid=false;
    let value='<([^ >/]+)',errormsg='',regex,playstart=0,playtime=0;
    $:msg = $files.length+' files';
    const check=()=>{
        invalid=false;
        errormsg='';
        try{
            new RegExp(value);
        } catch(e) {
            const at=e.message.lastIndexOf(':');
            errormsg=e.message.substr(at+1);
            invalid=true;
        }
    }
    const play=async ()=>{
        playstart=new Date();
        playtime=0;
        $playing=true;
        $logs=[];
        regex=new RegExp(value,'ug'+($ignorecase?'i':''));

        await tick();

        extractregex($files,{summarize:$summarize,regex},
            async (fileoutput)=>{
                if (!$playing) return true;
                if (!$summarize && $logs.length<5000) {
                    $logs= $logs.concat(fileoutput);
                }
                playtime=new Date()-playstart;
            }, finaloutput=>{
                if ($summarize) $logs=finaloutput;
                $playing=false;
            }
         );
    }
    const stop=()=>{

        $playing=false;
    }
</script>
<div class="extracttab">
    <input placeholder="正则表达式 Regular Expression" bind:value class="regex" class:invalid on:keyup={check} disabled={$playing} />
    {#if $playing} 
    <Btn icon='stop' onclick={stop}/>
    {:else if !invalid && value.length && $files.length} 
    <Btn icon='play' onclick={play}/>
    {/if}
    <br/>
    <CheckBox label="Σ " store={summarize} title="计算总数 summarize"/>
    <CheckBox label="A=a" store={ignorecase} title="勿略大小写 ignore case"/>
    
    <br/>
    <span class='msg'>{msg}</span>
    {#if playtime}{(playtime/1000).toFixed(2) +'s'}{/if}

    <span class='errormsg'>{errormsg}</span>
    <FilterFileList/>
</div>
<style>
    .extracttab {margin-left:0.5em;}
    .regex {height:1.5em;width:100%}

    .errormsg {color:red}
    .invalid {color:red}
</style>