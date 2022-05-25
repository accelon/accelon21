import t from './t.svelte';
import cite from './cite.svelte';
import blnk from './blnk.svelte';
import embed from './embed.svelte';
import unote from './unote.svelte';
import f from './f.svelte';
import fn from './fn.svelte';
import k from './k.svelte';
import {labeler} from '../js/store.js'
export default {};
labeler.set({ t,cs:cite, unote, f,fn,k, blnk ,embed});