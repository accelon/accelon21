<script>
import { onMount } from 'svelte';

    import Icons from './icons';
    export let onclick;
    export let disabled=false;
    export let title='';
    export let states={};
    export let storeid=null;
    let caption='';
    const setcaption=()=>{
        caption=states[$storeid]
        caption=Icons[caption]||caption;
    }
    const click=evt=>{
        if(disabled)return;
        if (storeid) {
            $storeid ++;
            if ($storeid>= Object.keys(states).length) $storeid=0;
        }
        setcaption();
        return onclick&&onclick(evt)
    }
    onMount(()=>setcaption());
    </script>
    <span class="button" class:disabled title={title} on:click={click} >
        <span>{@html caption}</span>
    </span>
    
    <style>
        .button{ cursor:pointer;fill:var(--button-selected);padding-right:0.3em}

        .button.disabled {cursor:auto;fill:none;stroke:var(--button-unselected) }
        .button.disabled:hover {fill:none; stroke: var(--button-unselected)}
        .button:hover {color:var(--hover); fill:var(--hover);stroke:var(--hover);}
    </style>