import {getCursorWord} from 'kaigua';
const onclick=evt=>{
  if (evt.ctrlKey) {
    const res=getCursorWord();
    chrome.runtime.sendMessage(res, function(response) {
      console.log(response);
    });
  }
}
if (document.location.protocol==='chrome-extension:') {
  console.log('injected'); 
  document.body.addEventListener('click',onclick);
}
