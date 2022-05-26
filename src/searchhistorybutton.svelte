<script>
import {queryhistory,QUERYSEP,addqueryhistory,delqueryhistory} from './js/query.js'
import {_} from './js/store.js';
export let lang='';
export let tofind;
export let hasResult;

$: qhis=queryhistory(lang,true);
$: deletable= qhis && ~$qhis.indexOf(tofind) && tofind.length;
$: addable = tofind.length>1 && !deletable && hasResult;

</script>

{#if addable}<span title={_(lang,"加到搜尋記錄 add to history")} on:click={()=>addqueryhistory(tofind,lang)}>★</span>{:else if deletable}<span class="delete" title={_(lang,"刪除搜尋記錄 remove from history")} on:click={()=>delqueryhistory(tofind,lang)}>☆</span>{/if}


<style>
	.delete {text-decoration: line-through}
</style>