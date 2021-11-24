<script>
import { writable } from 'svelte/store';

import VirtualScroll from './3rdparty/virtualscroll'
export let items;
export let ptk;
export let fullname=true;
</script>

<VirtualScroll start={-1}  keeps={25} data={$items} key="key" let:data >
<div>{fullname?data.text.replace(/\|.+/,''):data.text.replace(/.+\|/,'') }</div>
</VirtualScroll>