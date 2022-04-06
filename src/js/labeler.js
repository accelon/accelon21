import labeler_transclusion from '../labeler_transclusion.svelte';
import labeler_cite from '../labeler_cite.svelte';
import labeler_backlink from '../labeler_backlink.svelte';
import labeler_embed from '../labeler_embed.svelte';
import labeler_usernote from '../labeler_usernote.svelte';
import labeler_footnote from '../labeler_footnote.svelte';
import labeler_link from '../labeler_link.svelte';
import {labeler} from './store.js'
export default {};
labeler.set({ 
    t:labeler_transclusion,
    cs:labeler_cite,
    unote:labeler_usernote,
    f:labeler_footnote,
    k:labeler_link,
    blnk:labeler_backlink ,embed:labeler_embed});