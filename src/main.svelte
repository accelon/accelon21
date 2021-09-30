<script>
/*
function addtocache(evt){
  const reader = new FileReader();
  reader.addEventListener('load',async (event) => {
    const body = event.target.result;
	// const contentlength=new Blob([body]).size
	const contentlength=body.length;
	const cache = await caches.open('cache');
	const res=new Response(body,{status:200,statusText:'OK'
		,headers:{
			'Content-Type':'application/x-binary',
			'Content-Length': contentlength,
			'Date':file.lastModifiedDate,
			'Last-Modified':file.lastModifiedDate,
			'Cache-Control':'no-store',
			'Vary': 'Accept-Encoding',
		}
  	});
	console.log('putting file',file.name,'to cache')
	cache.put(file.name,res);
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  const file=evt.target.files[0];
  reader.readAsBinaryString(file);// .readAsText(file);// .readAsArrayBuffer(file);// readAsText(file);
}
*/
// import VirtualList from './virtualist'
import VirtualScroll from 'svelte-virtual-scroll-list'
import {listitems} from './store.js';
$: items=$listitems ;
// import ListItem from './listitem.svelte';
// let start,end,startFrom;
let toindex=0;
let vs;
$: vs&&vs.scrollToIndex(toindex)
</script>
<div class="main">
	Accelon22 <input type=number bind:value={toindex} />
	<!-- <div class='container'>
		<VirtualList {scrollToIndex} width="100%" height={800}
		itemCount={items.length} stickyIndices={[1,10,20]}  >
		<div slot="item" let:style {style} let:index class="row">{index+'.'+items[index].content}</div>
		</VirtualList>
	</div> -->

	<div class='container'>
		<VirtualScroll bind:this={vs} data={items}	key="key" let:data>
			<div style="height: {data.height}px}">{data.key}/{data.content} </div>
		</VirtualScroll>
	</div>
</div>
<style>
	.inputfile {background:lime;width:2rem;border-radius: 5px;}
	input[type="file"] {
    display: none;
	}
	.main {overflow-y:hidden; background:white; color:black;
		font-size:125%}
	.container {
		/* border-top: 1px solid #333;
		border-bottom: 1px solid #333; */
		min-height: 100px;
		height: calc(100vh - 2em);
	}

:global(.virtual-list-wrapper) {
	/* margin: 20px; */
	/* background: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
	background: #fafafa;
	/* color: #333; */
	font-family: -apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;
	/* -webkit-font-smoothing: antialiased; */
}

.row {
	padding: 0 0px;
	/* border-bottom: 1px solid #eee; */
	box-sizing: border-box;
	/* line-height: 50px; */
	/* font-weight: 500; */
	background: #fff;
}
</style>