<script>
import DoubleRangeSlider from '../comps/double-range-slider.svelte'
import {_,tosim} from '../js/store';
export let query='';
export let criterion;
export let method;
export let update;
export let component,lang;//unused
const {label}=criterion;
const ratioOf=num=>{
	if (!num || num<lowbound) num=lowbound;
	else if (num>highbound) num=highbound;
	return (num-lowbound)/range;
}
$: component,lang; 
$: lowbound = parseInt(label.nums[0]);
$: highbound = parseInt(label.nums[label.nums.length-1]);
$: range=highbound-lowbound;
$: start= ratioOf( parseInt(query.split('~')[0]) ) ;
$: end=  ratioOf( parseInt(query.split('~')[1]||highbound )) ;

const formatQuery=(start,end)=>{
	let s=(start?Math.round(start* range + lowbound):'')+'~'+(end<1?Math.round(end*range + lowbound):'');
	if (s=='~') s='';
	return s;
}
$: update ( method, formatQuery(start,end) )

</script>
<DoubleRangeSlider bind:start bind:end {range} basenum={lowbound} caption={_(lang,label.caption,$tosim)}/>