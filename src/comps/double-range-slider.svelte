<script>
    //from github.com/mhkeller/svelte-double-range-slider
	//import { clamp } from 'yootils';
    const nice = d => {
		if (!d && d !== 0) return '';
		return Math.round(d* range +basenum) ;
	}

    function clamp(num, min, max) {
        return num < min ? min : num > max ? max : num;
    }
    export let caption='';
    export let basenum=0;
	export let range= 100;
    export let start = 0;
	export let end = 1;
	let leftHandle;
	let body;
	let slider;
	function draggable(node) {
		let x;
		let y;
		function handleMousedown(event) {
			if (event.type === 'touchstart') {
				event = event.touches[0];
			}
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragstart', {
				detail: { x, y }
			}));
			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('touchmove', handleMousemove);
			window.addEventListener('touchend', handleMouseup);
		}
		function handleMousemove(event) {
			if (event.type === 'touchmove') {
				event = event.changedTouches[0];
			}
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragmove', {
				detail: { x, y, dx, dy }
			}));
		}
		function handleMouseup(event) {
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragend', {
				detail: { x, y }
			}));
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleMousemove);
			window.removeEventListener('touchend', handleMouseup);
		}
		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('touchstart', handleMousedown,{passive: true});
		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('touchstart', handleMousedown,{passive: true});
			}
		};
	}
	function setHandlePosition (which) {
		return function (evt) {
			const { left, right } = slider.getBoundingClientRect();
			const parentWidth = right - left;
			const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
			if (which === 'start') {
				start = p;
				end = Math.max(end, p);
			} else {
				start = Math.min(p, start);
				end = p;
			}
		}
	}
	function setHandlesFromBody (evt) {
		const { width } = body.getBoundingClientRect();
		const { left, right } = slider.getBoundingClientRect();
		const parentWidth = right - left;
		const leftHandleLeft = leftHandle.getBoundingClientRect().left;
		const pxStart = clamp((leftHandleLeft + evt.detail.dx) - left, 0, parentWidth - width);
		const pxEnd = clamp (pxStart + width, width, parentWidth);
		const pStart = pxStart / parentWidth;
		const pEnd = pxEnd / parentWidth;
		start = pStart;
		end = pEnd;
	}
</script>

<div class="double-range-container">
    
	<div class="slider" bind:this={slider}>
		<span class="caption">{caption}</span>
        <span class="start">{nice(start)} </span>
        <span class="end">{nice(end)}</span>
		<div
			class="body"
			bind:this={body}
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlesFromBody}"
			style="	left: {100 * start}%;	right: {100 * (1 - end)}%;	"
			></div>
		<div
			class="handle"
			bind:this={leftHandle}
			data-which="start"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlePosition('start')}"
			style="left: {100 * start}%"
		></div>
		<div
			class="handle"
			data-which="end"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlePosition('end')}"
			style="left: {100 * end}%"
		></div>
	</div>
</div>

<style>
    .start {text-align:left;z-index:99;user-select: none;}
    .end {float:right;z-index:99;user-select: none;}
	.double-range-container {
		width: 95%;
		height: 3em;
		user-select: none;
		box-sizing: border-box;
		white-space: nowrap;
		padding-left:0.5em;
	}
	.caption { position: absolute; top: -1.2em; left: 2em ;z-index:99; user-select: none; }
	.slider {
		position: relative;
		width: 95%;
		height: 5px;
		top: 50%;
		transform: translate(0, -50%);
		background-color: var(--slider-background);
		box-shadow: inset 0 7px 10px -5px #4a4a4a, inset 0 -1px 0px 0px #9c9c9c;
		border-radius: 4px;
	}
	.handle {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
	}
	.handle:after {
		content: ' ';
		box-sizing: border-box;
		position: absolute;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		background-color: rgba(255,255,255,0.5);
		border: 1px solid #7b7b7b;
		transform: translate(-50%, -50%)
	}
	/* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
	.handle:active:after {
		background-color: #ddd;
		z-index: 100;
	}
	.body {
		top: 0;
		position: absolute;
		background-color: var(--slider-background-selected);
		bottom: 0;
	}
</style>