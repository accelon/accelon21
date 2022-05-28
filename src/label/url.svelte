<script>
import {fetchHooks} from 'pitaka';
import {renderer} from '../js/store.js';
import Colorhr from '../comps/colorhr.svelte'
import Icons from '../comps/icons.js';

export let opening,text='';
export let nesting=0,attrs={};
export let closing=0;
export let ptk=null,i=0,clss='',starty=0,x=0,y=0,w=0,name='',side=0; //just for hidding the warning
$: text,ptk,i,clss,x,y,w,name,side,starty,closing,nesting;
let lines=[],R, error='';
const visit=()=>{
    let url=attrs['@'];
    if (!url) {
        error = 'mising @ attribute for link';
        return;
    }
    if (name==='github') {
        url= 'https://github.com/'+ (url.indexOf('/')=='-1'?'accelon/':'')+url
    }
    window.open(url);
}
</script>
{#if !opening}
<span class="url" on:click={()=>visit()}>{#if error}<span class="error">{error}</span>{:else}{@html Icons.url}{/if}</span>
{/if}
<style>
    .url:hover {fill: var(--external-link);stroke: var(--external-link)}
    .error {color: red}
</style>
