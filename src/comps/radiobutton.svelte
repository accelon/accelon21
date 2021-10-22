<script>
    import Icons from './icons.js';
    export let icon;
	export let store;
	export let title='';
    const svg=Icons[icon];
    const onclick=()=>$store= icon;
    </script>
    <button title={title} class:active="{$store==icon}" on:click={onclick} >{@html svg}</button>
    <style>
    	button {
		background: rgba(0,0,0,0);
		text-align: left;
		position: relative;
		border: none;
		height:35px;
		cursor:pointer;
		/* border-bottom: 3px solid transparent; */
		padding-left: 12px;
		/* padding-right: 8px; */
		color: var(--button-unselected);
		fill : var(--button-unselected);
		stroke : var(--button-unselected);
		border-radius: 0;
	}
	
	button.active {
		/* border-bottom: 3px solid var(--svg-highlight-stroke-color); */
		color:var(--highlight);
		stroke:var(--highlight);
		fill: var(--highlight) ;
	}

	button:hover { 
		stroke: var(--hover);
		fill: var(--hover);
		color: var(--hover);
	}

    </style>