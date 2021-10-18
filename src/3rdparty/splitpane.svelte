<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let type;
	export let pos = 60;
	let dragpos = pos ;  //position of dragable
	export let fixed = false;
	// export let buffer = 1;
	export let min;
	export let max;
    function clamp(num, min, max) {
        return num < min ? min : num > max ? max : num;
    }
	let w=100;
	let h=100;
	$: size = type === 'vertical' ? h : w;

/*	$: min = 100 * (buffer / size);
	$: max = 100 - min;  */

	$: pos = clamp(pos, min, max);
	$: dragpos = clamp(dragpos, min, max);

	const refs = {};

	let dragging = false;
	function setPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();
		const px = type === 'vertical'
			? (event.clientY - top)
			: (event.clientX - left);
		dragpos = 100 * px / size;
	}
	function setTouchPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();
		const px = type === 'vertical'
			? (event.touches[0].clientY - top)
			: (event.touches[0].clientX - left);
		dragpos = 100 * px / size;
	}

	function drag(node, callback) {
		const mousedown = event => {
			if (event.which !== 1) return;
			event.preventDefault();
			dragging = true;
			const onmouseup = () => {
				dragging = false;
				pos=dragpos;
				dispatch('change');
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
		const touchdown = event => {
			if (event.targetTouches.length > 1) return;
			event.preventDefault();
			dragging = true;
			const ontouchend = () => {
				dragging = false;
				pos=dragpos;
				dispatch('change');
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
	.container {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.pane {
		position: relative;
		float: left;
		width: 100%;
		height: 100%;
		overflow:hidden;
		/* overflow: auto; */
	}
	.mousecatcher {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(255,255,255,.01);
	}
	.divider {
		position: absolute;
		z-index: 10;
		display: none;
		background:rgba(10,10,10,.15);
		filter: blur(1px)
	}
	.divider::after {
		content: '';
		position: absolute;
		/* background-color: #eee; */
		background-color: var(--splitter);
	}
	.dragging {background:goldenrod}

	.horizontal {
		padding: 0 6px;
		width: 0;
		height: 100%;
		cursor: ew-resize;
	}
	.horizontal::after {
		left: 5px;
		top: 0;
		width: 0px;
		height: 100%;
	}
	.vertical {
		padding: 6px 0;
		width: 100%;
		height: 0;
		cursor: ns-resize;
	}
	.vertical::after {
		top: 5px;
		left: 0;
		width: 100%;
		height: 0px;
	}
	.left, .right, .divider {
		display: block;
	}
	.left, .right {
		height: 100%;
		float: left;
	}
	.top, .bottom {
		position: absolute;
		width: 100%;
	}
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
	{#if !fixed}
		<div class:dragging class="{type}  divider" style="{side}: calc({dragpos}% - 5px)"
		 use:drag={setPos} use:touchDrag={setTouchPos}></div>
	{/if}
</div>

{#if dragging}
	<div class="mousecatcher"></div>
{/if}