<script>
	export let onChange=null;
	export let type;
	export let pos = 60;
	export let min, max;
	let dragpos = pos ;  //position of dragging divider
    const clamp=(num, min, max)=> num < min ? min : num > max ? max : num;
	let w=100;
	let h=100;
	$: size = type === 'vertical' ? h : w;
	$: pos = clamp(pos, min, max);
	$: dragpos = clamp(dragpos, min, max);
	const refs = {};
	let dragging = false;
	function setPos(e) {
		const { top, left } = refs.container.getBoundingClientRect();
		const px = type === 'vertical'? (e.clientY - top): (e.clientX - left);
		dragpos = 100 * px / size;
	}
	function setTouchPos(e) {
		const { top, left } = refs.container.getBoundingClientRect();
		const px = type === 'vertical'? (e.touches[0].clientY - top): (e.touches[0].clientX - left);
		dragpos = 100 * px / size;
	}
	function drag(node, callback) {
		const mousedown = e => {
			if (e.which !== 1) return;
			e.preventDefault();
			dragging = true;
			const onmouseup = () => {
				dragging = false;
				pos=dragpos;
				onChange&&onChange();
				window.removeEventListener('mousemove', callback, false);
				window.removeEventListener('mouseup', onmouseup, false);
			};
			window.addEventListener('mousemove', callback, false);
			window.addEventListener('mouseup', onmouseup, false);
		}
		node.addEventListener('mousedown', mousedown, false);
		return {
			destroy() {
				node.removeEventListener('mousedown', mousedown, false);
			}
		};
	}
	function touchDrag(node, callback) {
		if (!navigator.maxTouchPoints) return; //not a touchable device
		const touchdown = e => {
			if (e.targetTouches.length > 1) return;
			e.preventDefault();
			dragging = true;
			const ontouchend = () => {
				dragging = false;
				pos=dragpos;
				onChange&&onChange();
				window.removeEventListener('touchmove', callback, false);
				window.removeEventListener('touchend', ontouchend, false);
			};
			window.addEventListener('touchmove', callback, false);
			window.addEventListener('touchend', ontouchend, false);
		}
		node.addEventListener('touchstart', touchdown, false);
		return {
			destroy() {
				node.removeEventListener('touchstart', touchdown, false);
			}
		};
	}
	$: side = type === 'horizontal' ? 'left' : 'top';
	$: dimension = type === 'horizontal' ? 'width' : 'height';
</script>
<style>
	.container {position: relative;width: 100%;height: 100%;}
	.pane {position: relative;float: left;width: 100%;height: 100%;overflow:hidden;	}
	.mousecatcher {	background: rgba(255,255,255,.01);position: absolute;	left: 0;top: 0;width: 100%;	height: 100%;	}
	.divider {background:rgba(10,10,10,.15);position: absolute;	z-index: 10;display: none;filter: blur(1px)}
	.divider::after {content: '';position: absolute;background-color: var(--splitter);}
	.dragging {background:highlight}
	.horizontal {padding: 0 6px;	width: 0;height: 100%;cursor: ew-resize;}
	.horizontal::after {left: 5px;top: 0;width: 0px;height: 100%;}
	.vertical {	padding: 6px 0;	width: 100%;height: 0;cursor: ns-resize;}
	.vertical::after {top: 5px;left: 0;width: 100%;height: 0px;	}	
	.left, .right, .divider {		display: block;	}
	.left, .right {	height: 100%;		float: left;	}
	.top, .bottom {	position: absolute;		width: 100%;	}
	.top { top: 0; }
	.bottom { bottom: 0; }
</style>
<div class="container" bind:this={refs.container} bind:clientWidth={w} bind:clientHeight={h}>
	<div class="pane" style="{dimension}: {pos}%;">
		<slot name="a"></slot>
	</div>
	<div class="pane" style="{dimension}: {100 - (pos)}%;">
		<slot name="b"></slot>
	</div>
	<div class:dragging class="{type}  divider" style="{side}: calc({dragpos}% - 5px)"
		use:drag={setPos} use:touchDrag={setTouchPos}></div>
</div>
{#if dragging}<div class="mousecatcher"></div>{/if}