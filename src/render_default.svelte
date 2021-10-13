<script>
    import {vstates,vlines,tosim,setLoc,cursor,labelerOf} from './js/store.js';
    import {composeSnippet,OfftextToSnippet, parseHook} from 'pitaka/offtext'
    import {OffTag} from 'pitaka/offtext';
    import {getTextHook} from './js/selection.js';
    import LineMenu from './linemenu.svelte';

    export let key=0 //缺少 y 的話，以 key 作 y
    export let y=0   //優先權較高
    export let text=''
    export let loc=''
    export let backlinks='';
    export let q=''; //the quote text
    export let hook='';
    export let ptk=null;
    let extra=[];
    
    if (backlinks && backlinks.length) { //convert backlink hook to tag
        const linksAt={};
        backlinks.forEach(bl=>{
            const [hstr,srcptr]=bl;
            const linetext=text||(ptk&&ptk.getLine(y||key));
            const hook=parseHook(hstr, linetext);
            if (!linksAt[hook.y+'_'+hook.x]) linksAt[hook.y+'_'+hook.x]=[];
            linksAt[hook.y+'_'+hook.x].push( [srcptr, hook.y, hook.x,hook.w] );
        })
        for (let i in linksAt) {
            const links=linksAt[i];
            const [srcptr, y,x,w]=links[0];
            const srcptrs=links.map(i=>i[0]).join(';');
            extra.push( new OffTag('blnk',{'@':srcptrs}, y,x,w))
        }
    }
    if (hook) {
        extra.push( new OffTag('cite',{},hook.y-y,hook.x,hook.w) );
        extra=extra;
    }

    extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);

    export let col=0;
    const vstate=vstates[col];
    const vl=vlines[col];
    const mouseup=async evt=>{
        if (evt.button!==0) return;
        if (loc) {
            await setLoc(ptk,col,loc);
        } else if (evt.target.tagName=='T') {
            const {hook,y,sel,t,ori}=getTextHook(ptk,evt);
            cursor.set({sel,t,ori});
            vstate.set(Object.assign($vstate,{hook,y,len:sel.length}))
        }
    }
</script>
<div class="linetext" on:mouseup={mouseup}>
{#if loc}
<div class="tocitem" class:loc>{text||(ptk&&ptk.getLine(y||key))}</div>
{:else}
{#if $vstate.y==key}<LineMenu {loc} {col} y={y||key} {ptk}/>{/if}
{#each OfftextToSnippet(text||ptk&&ptk.getLine&&ptk.getLine(y||key), extra) as snpt}
{#if labelerOf(snpt.open.name)}
<!-- open.name 存在則是此標籤的起點 -->
<svelte:component this={labelerOf(snpt.open.name)} opening={1} {ptk} starty={y||key} {...snpt.open} />
{/if}
<!-- 所有加諸在此段文字的樣式，一個標籤可能會被拆成多段 -->
{@html composeSnippet(snpt,y||key,$tosim)}
{#if labelerOf(snpt.close.name)}
<!-- close.name 存在，則是該標籤的終點。屬性在 sntp.open-->
<svelte:component this={labelerOf(snpt.close.name)} opening={0} {ptk} starty={y||key} {...snpt.open} />
{/if}
{/each}
{/if}
</div>

<style>
    .linetext {padding-top:0.5em;line-height:1.8}
    .loc {cursor:pointer}
    .loc:hover{color:var(--highlight)}
</style>