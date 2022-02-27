import { OFFTAG_REGEX } from "pitaka/offtext";

const offtagToken={
    token:function(stream){
        const m=stream.match(OFFTAG_REGEX,true);
        if (m) {
            return "offtag"
        }
        stream.skipTo('^') || stream.skipToEnd();
    }
}
export const decorateOfftag=cm=>{
    cm.addOverlay(offtagToken)
}