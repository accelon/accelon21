<script>
import { PATHSEP } from 'pitaka';
import Hyperlink from './comps/hyperlink.svelte';

export let attrs={};
export let opening=0,side=0;
export let ptk=null,i=0,clss='',x=0,y=0,starty=0,w=0,name='',text='',nesting=0;
$: i,clss,x,y,starty,w,name,text,nesting;
const addr=attrs['@'];
$: href=addr&&addr[0]===PATHSEP ? ptk.name+addr:addr||'';
</script>
{#if !opening}
<Hyperlink {side} {href}/>
{/if}

 