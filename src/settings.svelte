<script>
import StateBtn from './comps/statebutton.svelte';
import {_,tosim,edict,palitrans,systemsetting,aligning,factorization} from './js/store.js'
import { newopposite } from './js/addresses';
import {NAMESPACESEP,hasLang} from 'pitaka';
import Alignerbar from './alignerbar.svelte';
import Alignermain from './alignermain.svelte';

const openManual=evt=>{
    newopposite(0,'pitaka'+NAMESPACESEP);
    systemsetting.set(false);
}
const openAligner=evt=>{
    $aligning=!$aligning;
}
</script>
<div class="settings">
{#key $tosim}
    {#if $aligning}
        <Alignermain/>
    {:else}
    <div class="header">{ _('',"系統設置  System Configuration")}</div>

    <div class='clickable' on:click={openManual} >{_('',"操作說明 Instruction")}</div>

    {#if hasLang('zh')}
    <div>{_('',"漢字編碼")}
    <StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
    </div>
    {/if}

    <!-- <div>{_('',"嵌入式字典 Embedded Dictionary ")}<StateBtn states={{0:"否 No",1:"是 Yes"}} storeid={edict}/></div> -->
    
    {#if hasLang('pl')}
    <div class='clickable' on:click={openAligner} >{_('',"對齊編輯器 Aligner")}</div>
    <div>{_('',"巴利字體 Pali Script")}
    <StateBtn states={{'':_('',"檢約 Provident"),'iast':_('',"國際梵文轉寫 IAST"),
    'my':_('',"緬文 ဗမာစာ"),'th':_('',"泰文 ไทย"),'lo':_('',"老撾文 ລາວ"),'km':_('',"柬埔寨文 ភាសាខ្មែរ"),
    'hi':_('',"天城體 हिन्दी"),'si':_('',"僧伽羅文 සිංහල"),'tb':"藏文 བོད་སྐད།"}} storeid={palitrans}/>
    </div>
    <div>{_('',"化整為零 Factorization")}
    <StateBtn states={{'0':_('',"永不 Never"),'1':_('',"當行 Active Line"),'2':_('',"總是 Always") }} storeid={factorization}/>
    </div>
    {/if}

    {/if}
    
    <!-- <div>{_("原書頁碼 Folio number")}</div> -->
    <!-- <div>{_("反向連結 reverse link")}</div> -->
    <!-- <div>{_("點查字典 click to lookup")}</div> -->
    <!-- <div>{_("製作資料籃 Build Pitaka")}</div> -->
{/key}

<a target="_new" href="https://accelon.github.io" class='endofcontent'> </a>
</div>

<style>
    .header { background:var(--panel-background); color:var(--booktitle);height:1.5em}
    .settings  { -webkit-user-select: none; }
</style>