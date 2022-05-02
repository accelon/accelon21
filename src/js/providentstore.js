import { writable,derived } from "svelte/store";
export const loadTextItems=content=>{
	filecontent.set(content.split(/\r?\n/).map( (text,key)=>{ return {key:key+1,text} }));
}
export const filecontent=writable([]);
loadTextItems(`^bk#dn1[sIAlkVKnVDvgVgpALI]^ck#d1[1. bVrhVmjAlsUtVtM]^h[prIbVbAjkkTA]^n1 evM mE sUtM –
ekM smyM BgvA anVtrA c rAjghM anVtrA c nALnVdM adVDAnmgVgpVpWIpnVnO hOtI mhtA BIkVKUsNVGEn sdVDIM pYVcmtVtEhI BIkVKUstEhI।
sUpVpIyOpI KO prIbVbAjkO anVtrA c rAjghM anVtrA c nALnVdM adVDAnmgVgpVpWIpnVnO hOtI sdVDIM anVtEvAsInA bVrhVmdtVtEn mANvEn।
BANvAr,BANvArO,BANvArEhI
BAg*,BAgM,BAgO,BAgE
BAjn,BAjnM,BAjnAnI,BAjnEn
BAr,BArM,BArO,BArE,BArsUtVtM,BArYVc,BArA,BArsVs,BArIyM
BArAdAn,BArAdAnM,BArAdAnYVc
BArdVvAj*,BArdVvAjO,BArdVvAjM,BArdVvAjsVs,BArdVvAjOpI,BArdVvAjsUtVtM,BArdVvAjEn
BArdVvAjgOtVt,BArdVvAjgOtVtO,BArdVvAjgOtVtsVs,BArdVvAjgOtVtM,BArdVvAjgOtVtEn
BArhAr,BArhArO,BArhArYVc
BArnIkVKEpn*,BArnIkVKEpnM,BArnIkVKEpnYVc
BAs*,BAstI,BAstIA,BAsIsVstI,BAsIsVstIA,BAsIM,BAsItbVbM,BAsM,BAsE,BAsIsVs,BAsIsVsM
BAsEyVy*,BAsEyVyUM,BAsEyVyA
BAsI,BAsIsVstI,BAsIsVstIA,BAsIM,BAsItbVbM,BAsIsVs,BAsIsVsM
BAsIsVs*,BAsIsVstI,BAsIsVstIA,BAsIsVsM
BAsIt*,BAsItM,BAsItsVs,BAsItA,BAsItE,BAsItEnpI,BAsItO,BAsItUM,BAsItmsVs,BAsItAnI
BAsItbVb,BAsItbVbA,BAsItbVbO,BAsItbVbM
BAsmAn,BAsmAnsVs,BAsmAnYVc
BAsnVt,BAsnVtM,BAsnVtE,BAsnVtU
BAst,BAstE,BAstO,BAstU
BAstI*,BAsnVtI,BAssI,BAssIA,BAstIAtI,BAsnVtIyA
BAsy,BAsyE,BAsyI,BAsyA
BAt,BAtA,BAtApI,BAtUpI,BAtU,BAtUsUtVtM,BAtEv
BAtI,BAsIsVstI,BAsIsVstIA,BAsIM,BAsItbVbM,BAsIsVs,BAsIsVsM
BAtU*,BAtUpI,BAtUsUtVtM
BAtr,BAtrA,BAtrO,BAtrI,BAtrmVpI
BAv,BAvEtI,BAvEsVstI,BAvEhI,BAvEtbVbM,BAvIM,BAvETA,BAvEtbVbYVc,BAvyM,BAvEtbVb,BAvEtIA,BAvE,BAvytI,BAvEtbVbsUtVtM
BAvE*,BAvEtI,BAvEsVstI,BAvEtbVbM,BAvEtbVbYVc,BAvEtbVb,BAvEtIA,BAvEtbVbsUtVtM
BAvEnVt,BAvEnVtO,BAvEnVtM
BAvEsVstI*,BAvEsVsnVtI,BAvEsVssI
BAvEt,BAvEtUM,BAvEtU
BAvEtI*,BAvEmI,BAvEsI,BAvEnVtI,BAvEsIM,BAvEmIA,BAvEsVsAm
BAvEtU*,BAvEtUM,BAvEtUA
BAvEtbVb*,BAvEtbVbA,BAvEtbVbO,BAvEtbVbM,BAvEtbVbYVc,BAvEtbVbAnI,BAvEtbVbsUtVtM
BAvEyV,BAvEyVy,BAvEyVyM
BAvEyVy*,BAvEyVyM,BAvEyVyA
BAvEyVyAtI,BAvEyVyAsI,BAvEyVyAsIA
BAvIt*,BAvItA,BAvItO,BAvItM,BAvItAnI,BAvItE,BAvItEsU,BAvItEn,BAvItsUtVtM
BAvItcItVt,BAvItcItVtO,BAvItcItVtA
BAvItkAy,BAvItkAyO,BAvItkAyOmVhI,BAvItkAyA
BAvItpYVY,BAvItpYVYO,BAvItpYVYA
BAvItsIAl,BAvItsIAlO,BAvItsIAlA
BAvIttVt,BAvIttVtA,BAvIttVtO,BAvIttVtEn,BAvIttVtsVs
BAvn,BAvnM,BAvnA,BAvnAsUtVtM`);

export const tofind=writable("");
export const cursorword=writable("");
export const activeline=writable(1)
export const toiast=writable(true);
const filterlines=([items,_tofind])=>{
	const out=[];
    if (_tofind.trim()) {
    	try {
	        const reg=new RegExp(_tofind);
	        for (let i=0;i<items.length;i++) {
	        	if (items[i].text.match(reg)) {
	        		out.push(items[i]);
				}
	        }
    	} catch(e) {
    		return items;
    	}
    }  else return items;
    return out;
}

export const vscrollitems=derived([filecontent,tofind],filterlines);
