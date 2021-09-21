<script>
    export let config={};

</script>
<div>
    <div>name:{config.name||''}</div>
    <div>title:{config.title||''}</div>
    <div>files:{config.files&&config.files.length}</div>
</div>