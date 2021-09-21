<script>
    import Btn from './button.svelte';
    import ConfigInfo from './configinfo.svelte'
    import CheckBox from './checkbox.svelte';
    import {files,playing,config,errormsg, logs,saveptkhandle,exportpitaka,cachestorage} from './store';
    import {cacheStorageReady,chromefs} from 'pitaka/platform';
    import {Builder} from 'pitaka/basket';

    let playtime=0,playstart=0;
    $: buildable= $config.name && $files.length>1 && ($cachestorage||$exportpitaka);

    const opencache=()=>{
        caches.open('v1').then(function(cache) {
            const res=new Response({body:'abc'});
            cache.put('/abc',res)
        });
    }

    const pickSaveFile=async evt=>{
        const saveOpts={suggestedName:$config.name+'.ptk',...chromefs.savePitakaOption}
        const savehandle=await showSaveFilePicker(saveOpts);
        if (savehandle) {
            $saveptkhandle=savehandle;
            return true;
        }
        return false;
    }
    
    const build=async ()=>{
        const log=function(...msg){
            $logs.push(msg.join(' '));
            $logs=$logs;
        }
        $logs=[];
        $playing=true;
        playstart=new Date();
        log('start build',playstart);
       
        const name=$config.name;
        const builder=new Builder({name,config:$config,log}); //core chinese text
        for (let i=0;i< $files.length;i++) {
            playtime=new Date()-playstart;
            if (!$playing) {
                $errormsg='build process stop';
                return;
            }
            await builder.addFile($files[i]);
        }
        builder.finalize();
        
        if ($cachestorage) {
            builder.save({cache:true});
            log('written to cachestorage');
        }
        if ($exportpitaka) {
            builder.save({file:$saveptkhandle});
            log('written to ', $saveptkhandle.name);
        }

        log('build completed',new Date())
        $playing=false;

    }
    const stop=()=>{

    }
</script>
<div>
    
    <CheckBox icon="importPitaka" disabled={!cacheStorageReady} id="cachestorage" title="离线数据库 Offline Database"/>
    <CheckBox icon="exportPitaka" id="exportpitaka" beforeChecked={pickSaveFile} title="汇出文件 Export file"/>
   
    {#if $playing} 
    <Btn icon='stop' onclick={stop}/>
    {:else if buildable} 
    <Btn icon='play' onclick={build}/>
    {#if playtime}{(playtime/1000).toFixed(2) +'s'}{/if}
    {/if}
    <br/>
    <ConfigInfo config={$config}/>

</div>