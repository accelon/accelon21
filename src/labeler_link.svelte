<script>
import { PATHSEP } from 'pitaka';

export let attrs={};
export let opening=0,side=0;
export let ptk,i=0,clss,x,y,starty=0,w=0,name='',text,nesting=0; //just for hidding the warning
import Hyperlink from './comps/hyperlink.svelte';
const addr=attrs['@'];
$: href=addr[0]===PATHSEP ? ptk.name+addr:addr;
</script>
{#if !opening}
<Hyperlink {side} {href}/>
{/if}

 