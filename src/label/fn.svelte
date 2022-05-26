<script>
import { PATHSEP } from 'pitaka';
import Hyperlink from '../comps/hyperlink.svelte';

export let attrs={};
export let opening=0,side=0;
export let ptk=null,i=0,clss='',x=0,y=0,starty=0,w=0,name='',text='',nesting=0;
$: i,clss,x,y,starty,w,name,text,nesting,side;
const id=attrs.id;
const addr=ptk.locOf(starty).replace('-fn.','.').replace(/:\d+$/,'');
const [fy]=ptk.getPageRange( addr.replace(/[a-z]+:/,'')+'.f='+id);
const href=ptk.locOf(fy);
</script>
{#if opening}
<Hyperlink {href} /><span class="footnote">{id}</span>
{/if}