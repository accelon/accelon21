import labeler_transclusion from '../labeler_transclusion.svelte';
import labeler_backlink from '../labeler_backlink.svelte';
import {labeler} from './store.js'
export default {};
labeler.set({'t':labeler_transclusion,'blnk':labeler_backlink });