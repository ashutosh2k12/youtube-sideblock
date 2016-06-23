chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if(request.method == "setStatus"){
   		localStorage['settings'] = JSON.stringify(request.data);
  	}
  	if(request.method == "getStatus"){
  		if (localStorage['settings'] == undefined) { 
  			localStorage['settings'] = JSON.stringify({disablelink:1,disableattonate:1});
  		}
   		sendResponse({ data: JSON.parse(localStorage['settings'])});
  	}
    return true;
});

function triggerCS() {
  chrome.tabs.query({}, function(tabs) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    for (var i=0; i<tabs.length; i++) {
      var match = tabs[i].url.match(regExp);
      if(match && match[2].length == 11){
        chrome.tabs.sendMessage(tabs[i].id, {action: "update_ls_link"});
      }
    }
  });
}


function openOrFocusOptionsPage() {
   var optionsUrl = chrome.extension.getURL('options.html'); 
   chrome.tabs.query({}, function(extensionTabs) {
      var found = false;
      for (var i=0; i < extensionTabs.length; i++) {
         if (optionsUrl == extensionTabs[i].url) {
            found = true;
            chrome.tabs.update(extensionTabs[i].id, {"selected": true});
         }
      }
      if (found == false) {
          chrome.tabs.create({url: "options.html"});
      }
   });
}

//Popup click handler
chrome.browserAction.onClicked.addListener(function(tab) { openOrFocusOptionsPage(); });