import PageViewer from '../pageviewer.svelte'
import ExcerptViewer from '../pageviewer.svelte'
export default PageViewer;
import {viewers} from './store.js'
viewers.set({default:PageViewer, e: ExcerptViewer});