<script>
    // import JSZip from 'pitaka/jszip';
    import { chromefs ,readFiles} from 'pitaka/platform';
    import {files} from './store';
    const savezip=async ()=>{
        const newHandle = await showSaveFilePicker(chromefs.saveZipOption);

        // create a FileSystemWritableFileStream to write to
        const writableStream = await newHandle.createWritable();

        // const blob=new Blob('aaaa');
        // write our file

        const zip= new JSZip();

        await readFiles($files,async (filecontent,filename)=>{
            zip.file(filename,filecontent );
        });
        
        const opts={type:"blob",compression: "DEFLATE",compressionOptions: { level: 6}};
        await zip.generateAsync(opts).then(blob=>{
            writableStream.write(blob);
        });

        // close the file and write the contents to disk.
        await writableStream.close();
    }
    const opencache=()=>{
        caches.open('v1').then(function(cache) {
            const res=new Response({body:'abc'});
            cache.put('/abc',res)
        });
    }
</script>
<div>
    <button on:click={opencache}>open cache</button>
    <button on:click={savezip}>savezip</button>
    builder

</div>