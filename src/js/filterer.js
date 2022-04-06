import {filterer} from './store.js'
import default_filter from '../filterer/default.svelte'
import entry_zh from '../filterer/entry_zh.svelte'
import category from '../filterer/category.svelte'
export default default_filter;
filterer.set({default:default_filter,entry_zh,category});