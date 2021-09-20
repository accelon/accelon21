<script>
    export let label='checkbox';
    export let id;
    export let title='';
    import store from './store.js';
    const storeid=store[id];
    
    const toggle=()=>{
        $storeid = ! $storeid;
    }
</script>
<span class="button" title={title} class:yes={$storeid} on:click={toggle}>{label}</span>

<style>
    .button{cursor: pointer;padding-right:5px}
    .button:hover{color:greenyellow}
    .button:before{content:'☐ '}
    .yes:before {content:'☑ ';color:lime}
</style>