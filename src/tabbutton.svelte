<script>
    import Icons from './icons';
    import {tab} from './store';
    
    export let icon;
	export let title='';
    const svg=Icons[icon];
    $: tabid='tab-'+icon;
    const onclick=()=>{
        $tab= 'tab-'+icon;
    }
    </script>
    <button title={title} class:active="{$tab==tabid}" on:click={onclick} >{@html svg}</button>
    
    <style>
        :root {
			--unselected : #333; 
			--selected: #FFFFFF ; 
			--hover: greenyellow
		}
    	button {
		background: rgba(0,0,0,0);
		text-align: left;
		position: relative;
		border: none;
		height:36px;
		cursor:pointer;
		border-bottom: 3px solid transparent;
		/* padding: 12px 12px 8px 12px; */
		color: var(--unselected);
		fill : var(--unselected);
		border-radius: 0;
	}
	
	button.active {
		border-bottom: 3px solid lime;
		color:var(--selected);
		fill: var(--selected) ;
	}

	button:hover { 
		fill: var(--hover)
	}

    </style>