import { writable } from "svelte/store";
export const editor=writable({});
export const editinghandle=writable(null);
export const blanklinecount=writable(0);
export const alignbkid=writable('');
export const alignloc=writable('');
export const aligntop=writable(0);
