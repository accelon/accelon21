import {scanFiles} from 'pitaka/platform';
import {sleep} from 'pitaka/utils'
export async function extractregex (files,opts,onfileend,onfinish){
    const occurs={};

    await scanFiles(files,async (filecontent,filename)=>{
        const arr=[];
        if (opts.summarize) {
            filecontent.replace(opts.regex,(m,m1)=>{
                const pat=(typeof m1=='number')?m:m1;
                if (!occurs[ pat ]) occurs[pat]=0;
                occurs[pat]++;
            })
            if (onfileend) {
                const stop=await onfileend(arr);
                if (stop)return true;
            }
        } else {
            arr.length=[];
            const lines=filecontent.split(/\r?\n/);
            let found=false;

            for (let i=0;i<lines.length;i++) {
                if (lines[i].match(opts.regex)) {
                    if (!found) {
                        arr.push('<hr>'+filename); 
                        found=true;
                    }
                    const line=lines[i].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                    arr.push( (i+1)+':'+line.replace(opts.regex,m=> '<b>'+m+'</b>') );
                    if (arr.length>100) {
                        arr.push('---too many---')
                        break;
                    }
                }
               
            }
            // if (found) await sleep(1000)
            if (onfileend) {
                const stop=await onfileend(arr);
                if (stop)return true;
            }
        }
    })

    if (onfinish) {
        let output=[];
        for (let key in occurs) output.push([occurs[key],key]);
        output.sort((a,b)=>b[0]-a[0]);
        output=output.map(a=>a.join('\t'));
        await onfinish(output);
    }

}