<script>
    import TabSelector from './tabselector.svelte';
    import PitakaList from './pitakalist.svelte'
    export let tabid;
</script>

<div class="container">
<div class="controlbar"><TabSelector {tabid}/></div>
<div><PitakaList  {tabid}/></div>
</div>

<style>

</style>