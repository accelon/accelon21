<script>
import StateBtn from './comps/statebutton.svelte';
import {_,tosim} from './js/store.js'

</script>
<div class="settings">
{#key $tosim}
    <div class="header">{ _("系統設置  System Configuration")}</div>
    <StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
    <div>{_("原書頁碼 Folio number")}</div>
    <div>{_("反向連結 reverse link")}</div>
    <div>{_("點查字典 click to lookup")}</div>
    <div>{_("操作說明 Instruction")}</div>
    <div>{_("製作資料籃 Build Pitaka")}</div>
{/key}

</div>

<style>
    .header { background:var(--panel-background)}
    .settings  { -webkit-user-select: none; }
</style>