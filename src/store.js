import { writable } from "svelte/store";

export const files=writable([]);
export const logs=writable(['ab','cd']);
export const tab=writable('tab-files');
export const summarize=writable(true);
export const ignorecase=writable(false);
export const playing=writable(false);
export default {playing,files,tab,summarize,ignorecase}