import {filterer} from './store.js'
import default_filter from '../filterer/default.svelte'
import entry_zh from '../filterer/entry_zh.svelte'
import entry_pl from '../filterer/entry_pl.svelte'
import entry_en from '../filterer/entry_en.svelte'
import heading_zh from '../filterer/heading_zh.svelte'
import heading_pl from '../filterer/heading_pl.svelte'
import heading_en from '../filterer/heading_en.svelte'
import checkboxes from '../filterer/checkboxes.svelte'
export default default_filter;
filterer.set({default:default_filter,checkboxes,
entry_zh,entry_pl,entry_en,
heading_zh,heading_pl,heading_en,
});