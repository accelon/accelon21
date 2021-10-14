<script>
    import Btn from './button.svelte';
    import ConfigInfo from './configinfo.svelte'
    import CheckBox from './checkbox.svelte';
    import {files,playing,playingfile,
        config,errormsg, logs,saveptkhandle,exportpitaka,cachestorage} from './js/store_toolbox.js';
    import {cacheStorageReady,chromefs} from 'pitaka/platform';
    import {Builder} from 'pitaka/basket';
    //import { sleep } from 'pitaka/utils';

    let playtime=0,playstart=0;
    $: buildable= $config && $files.length>1 && ($cachestorage||$exportpitaka);

    const pickSaveFile=async evt=>{
        if (!$config.name)return;
        const saveOpts={suggestedName:$config.name+'.ptk',...chromefs.savePitakaOption}
        const savehandle=await showSaveFilePicker(saveOpts);
        if (savehandle) {
            $saveptkhandle=savehandle;
            return true;
        }
        return false;
    }
    let timer1;
    const log=function(...msg){
            $logs.push(msg.join(' '));
            $logs=$logs;
    }
    const build=async ()=>{
         timer1=setInterval(()=>{
            playtime=new Date()-playstart;
        },100)
        $logs=[];
        $playing=true;
        playstart=new Date();
        log('start build',playstart);

        const diskfiles={};
        for (let i=0;i<$files.length;i++) {
            diskfiles[$files[i].name]=$files[i];
        }
       
        const name=$config.name;
        const builder=new Builder({name,config:$config,log}); //core chinese text
        for (let i=0;i< $config.files.length;i++) {
            const diskfile=diskfiles[ $config.files[i] ];
            
            if (!$playing) {
                $errormsg='build process stop';
                break;
            }
            $playingfile=i;
            // await sleep(1000)
            await builder.addFile(diskfile);
        }
        clearInterval(timer1);
        if ($errormsg) return;
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
        log('Force stop')
        clearInterval(timer1);
        $playing=false;
    }
</script>
<div>
    
    <CheckBox icon="importPitaka" disabled={!cacheStorageReady} store={cachestorage} title="离线数据库 Offline Database"/>
    <CheckBox icon="exportPitaka" store={exportpitaka} beforeChecked={pickSaveFile} title="汇出文件 Export file"/>
   
    {#if $playing} 
    <Btn icon='stop' onclick={stop}/>
    {:else if buildable} 
    <Btn icon='play' onclick={build}/>
    {/if}

    {#if playtime}{(playtime/1000).toFixed(1) +'s'} ,  {($playingfile+1)+"/"+$config.files.length} {/if}
   
    <br/>
    <ConfigInfo config={$config}/>

</div>