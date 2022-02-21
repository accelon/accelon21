<script>
import StateBtn from './comps/statebutton.svelte';
import {_,tosim,palitrans} from './js/store.js'

</script>
<div class="settings">
{#key $tosim}
    <div class="header">{ _("系統設置  System Configuration")}</div>

    <div>{_("漢字編碼")}
    <StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
    </div>
    <div>{_("巴利文 Pali Transliteration")}
    <StateBtn states={{'':_("檢約 Provident"),'iast':_("國際梵文轉寫 IAST"),
    'my':_("緬文 ဗမာစာ"),'th':"泰文 ไทย",'lo':_("老撾文 ລາວ"),'km':"柬埔寨文 ភាសាខ្មែរ",
    'hi':_("天城體 हिन्दी"),'si':_("僧伽羅文 සිංහල"),'tb':"藏文 བོད་སྐད།"}} storeid={palitrans}/>
    </div>
    <div>{_("原書頁碼 Folio number")}</div>
    <div>{_("反向連結 reverse link")}</div>
    <div>{_("點查字典 click to lookup")}</div>
    <div>{_("操作說明 Instruction")}</div>
    <div>{_("製作資料籃 Build Pitaka")}</div>
{/key}

<a target="_new" href="https://accelon.github.io" class='endofcontent'>
</a>
</div>

<style>
    .header { background:var(--panel-background); color:var(--booktitle);height:1.5em}
    .settings  { -webkit-user-select: none; }
</style>