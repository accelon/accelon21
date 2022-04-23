<script>
import CheckBox from './comps/checkbox.svelte'
import {wordinfo} from './js/palistore.js'
</script>
<span><CheckBox title='show Word Info' label='W' store={wordinfo}/></span>