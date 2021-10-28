<script>
import {OfftextToHtml} from 'pitaka/offtext';
const code=document.getElementsByTagName('code');
if (code[0]) {
    code[0].classList.add('code');
    const rawlines=code[0].innerHTML.split(/\r?\n/);
    const out=[];
    rawlines.forEach(line=>{
        const html=OfftextToHtml(line,[],true);
        out.push(html)
    })
    code[0].innerHTML=out.join('\n');
}

</script>

<div>
    <div class="div1">hello</div>
</div>

<style>
   
    :global(.code) {white-space: pre-wrap; line-height: 200%;padding-left:2em}
    .div1 {color:blue}
</style>