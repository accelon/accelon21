import {derived, writable ,get} from "svelte/store";
export const editor=writable({});
export const editinghandle=writable(null);
export const blanklinecount=writable(0);