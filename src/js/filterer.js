import {filterer} from './store.js'
import default_filter from '../filterer/default.svelte'
import entry_zh from '../filterer/entry_zh.svelte'
import checkboxes from '../filterer/checkboxes.svelte'
export default default_filter;
filterer.set({default:default_filter,entry_zh,checkboxes});