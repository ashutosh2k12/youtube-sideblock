var BGPage = chrome.extension.getBackgroundPage();
$(document).ready(function(){
	
	init_settings();

	$(document).on('change',".option_link",function() {
		var disableattonate = 1;
		if (localStorage['settings'] != undefined) { 
			var _settings = JSON.parse(localStorage['settings']);
			disableattonate = _settings.disableattonate;
		}
		var disablelink = (this.checked)?1:0;
	    localStorage['settings'] = JSON.stringify({disablelink:disablelink,disableattonate:disableattonate});
	    console.log('settings',localStorage['settings']);
	    BGPage.triggerCS();
	});

	$(document).on('change',".option_attonation",function() {
	    var disablelink = 1;
		if (localStorage['settings'] != undefined) { 
			var _settings = JSON.parse(localStorage['settings']);
			disablelink = _settings.disablelink;
		}
		var disableattonate = (this.checked)?1:0;
	    localStorage['settings'] = JSON.stringify({disablelink:disablelink,disableattonate:disableattonate});
	    console.log('settings',localStorage['settings']);
	    BGPage.triggerCS();
	});
});


function init_settings(){
	console.log('settings',localStorage['settings']);
	if (localStorage['settings'] != undefined) { 
		var settings = JSON.parse(localStorage['settings']);
		if(settings.disableattonate && settings.disableattonate == 1){
			$(".option_attonation").attr('checked',true);
		}
		if(settings.disablelink && settings.disablelink == 1){
			$(".option_link").attr('checked',true);
		}
	}
}
