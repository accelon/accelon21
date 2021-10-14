<script>

import {parsePointer} from 'pitaka/offtext'
import {tosim} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
export let count=0;
export let ptk=null;
export let link=null;
export let from=null;

const parsed=parsePointer(link);

const visit=()=>{

}

</script>

<span class="foreignlink" on:click={visit}>{toSim(parsed.bk,$tosim)}{parsed.c?'/'+toSim(parsed.c,$tosim):''}</span>
<style>
    .foreignlink{font-size:85%;
        cursor:pointer;padding-left:1px;padding-right:2px;border-left:1px solid var(--button-unselected)}
    .foreignlink:hover{color:var(--highlight)}
</style>