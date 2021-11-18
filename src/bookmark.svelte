<script>
import Icons from './comps/icons.js';
import {saveBookmarks} from './js/bookmarks';
export let bookmarks=null; // this is a store created by addresses.js
export let dy=0;
export let loc='';
export let x=0,y=0,clss='';
export let ptk=null;
let editing=false,timer; 
const toggleBookmark=evt=>{
    let bm=$bookmarks[dy];

    if (!bm) editing=true;
    clearTimeout(timer);
    timer=setTimeout(()=>{
        editing=false;
    },3600);

    if (!bm) {
        bm=1;
    } else if (editing) {
        bm++;
    } else bm=0;
    if (bm>6) bm=2;
    $bookmarks[dy]=bm;
    saveBookmarks(ptk,loc,$bookmarks);
}
const bookmarkicon=()=>{
    if (!bookmarks)return '　';
    const bm=$bookmarks[dy];
    if (bm===1) return Icons.bookmark;
    else if (bm>1) return Icons.bookmarksolid;
    return '　';
}
</script>
<span class={'bm bm'+$bookmarks[dy]} class:blink={editing} on:click={toggleBookmark} >{@html bookmarkicon($bookmarks)}</span>

<style>
    .bm {float:right;fill:silver;cursor:pointer}
    .bm:hover {outline:1px dotted silver}
    .bm2 {fill:var(--marker1)}
    .bm3 {fill:var(--marker2)}
    .bm4 {fill:var(--marker3)}
    .bm5 {fill:var(--marker4)}
    .bm6 {fill:var(--marker5)}
</style>