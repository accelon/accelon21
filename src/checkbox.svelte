<script>
    import Icons from './icons';
    export let label='';
    export let id;
    export let title='';
    export let icon='';
    export let beforeChecked=null;
    const svg=Icons[icon]||'';
    import store from './store.js';
    const storeid=store[id];
    export let disabled=false;
    const toggle=async evt=>{
        if (disabled) return;
        if (!$storeid && beforeChecked) {
            if (await beforeChecked(evt)) $storeid = true;
        } else{
            $storeid = ! $storeid; //normal toggle
        }
    }
</script>
<span class="button" title={title} class:yes={$storeid} 
class:disabled on:click={toggle}>{@html svg}{label}</span>

<style>
    .button{cursor: pointer;padding-right:5px}
    .button:hover{color:greenyellow;stroke:greenyellow}
    .button:before{content:'☐ '}
    .yes:before {content:'☑ ';color:lime}

    .disabled {color:silver;text-decoration: line-through;}
    .disabled:before{content:'☐ ';color:silver}
</style>