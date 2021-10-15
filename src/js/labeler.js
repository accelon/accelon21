import labeler_transclusion from '../labeler_transclusion.svelte';
import labeler_backlink from '../labeler_backlink.svelte';
import labeler_embed from '../labeler_embed.svelte';
import {labeler} from './store.js'
export default {};
labeler.set({t:labeler_transclusion,blnk:labeler_backlink ,embed:labeler_embed});