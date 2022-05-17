export const enumSearchSite=(str,lang)=>{
	const sites=[
		{url:"https://www.google.com/search?q=$$",icon:"google"}
	]
	if (lang.slice(0,2)=='zh') {
		sites.push({url:'https://www.baidu.com/s?wd=$$',icon:"baidu"})
	}

	return sites.map(site=> {
		return Object.assign(site,{url:site.url.replace("$$",str)} )
	});
}