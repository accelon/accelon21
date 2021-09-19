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
</script>
<div class="main">
Accelon22
<label class="inputfile">
<input on:change={addtocache} type='file' accept=".ptk,.mkv"/>
※
</label>
</div>
<style>
	.inputfile {background:lime;width:2rem;border-radius: 5px;}
	input[type="file"] {
    display: none;
	}
	.main {margin:0.5em;font-size:145%}
</style>