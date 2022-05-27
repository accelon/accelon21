<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import Buttons from './comps/buttons.svelte';
import CriteriaPanel from './criteriapanel.svelte';
export let criteria, aligned , aptk=[];
export let ptk;
export let scrollStart=0;
$: lang=ptk&&ptk.header.lang;
$: criteriaObj=ptk.parseCriteria(criteria);
let values=aligned.split(',').filter(it=>!!it);
const updateQuery=(method,query)=>{
    criteriaObj[method]=query;
    const newcriteria=ptk.stringifyCriteria(criteriaObj);
    if (newcriteria!==criteria) {
        criteria=newcriteria;
    }
}
$: aligned=values.filter(it=>!!it).join(',');
</script>
<Hamburgermenu {scrollStart}>
    <Buttons bind:values items={aptk} />
    {#if aptk.length}<hr/>{/if}
    <CriteriaPanel {ptk} {criteria} {updateQuery} {lang}/>
</Hamburgermenu>