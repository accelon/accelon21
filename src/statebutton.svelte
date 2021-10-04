<script>
import { onMount } from 'svelte';
import { get } from 'svelte/store';

    import Icons from './icons';
    export let onclick;
    export let disabled=false;
    export let title='';
    export let forceupdate='';
    export let states={};
    export let storeid=null;
    export let stylestore=null;
    let caption='';
    const setcaption=()=>{
        caption=states[$storeid]
        caption=Icons[caption]||caption;
    }
    const highlight=str=>{
        if (!stylestore) return str;
        return str.replace(/\$(\w+)/g,(m,m1)=>{
            return get(stylestore[m1]);
        })
    }
    const click=evt=>{
        if(disabled)return;
        if (storeid) {
            $storeid ++;
            if ($storeid>= Object.keys(states).length) $storeid=0;
        }
        onclick&&onclick(evt);
        setcaption();
    }
    onMount(()=>setcaption());
    </script>
    <span class="button" class:disabled title={title} on:click={click} >
        <span>{@html highlight(caption,forceupdate)}</span>
    </span>
    
    <style>
        .button{ vertical-align: top;cursor:pointer;fill:var(--button-selected);padding-right:0.2em}
        .button.disabled {cursor:auto;fill:none;stroke:var(--button-unselected) }
        .button.disabled:hover {fill:none; stroke: var(--button-unselected)}
        .button:hover {color:var(--hover); fill:var(--hover);stroke:var(--hover);}
    </style>