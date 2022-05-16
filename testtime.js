import { openBasket } from "pitaka";
import {nodefs} from "pitaka/platform"
await nodefs;
const ptk=await openBasket('cb-t');
// console.log(ptk)
console.log(ptk.loadtime)