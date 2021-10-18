<script>
import StateBtn from './statebutton.svelte';
import {tosim} from './js/store.js'
import {toSim} from 'lossless-simplified-chinese'

</script>
<div class="settings">
    <div class="header">{ toSim("系統設置",$tosim)} System Configuration</div>
    <StateBtn states={{0:"原本",1:"简體",2:"简体"}} storeid={tosim}/>
</div>

<style>
    .header { background:var(--panel-background)}
    .settings  { -webkit-user-select: none; }
</style>