

$(document).ready(function () {
	var currentUrl = window.location.href; 
	var arrived = false

	//Disable sidebar if in page shell
	$(document).arrive(".player-api", {fireOnAttributesModification: true}, function() {
		getSettings(function(settings){
			if(typeof settings.data.disableattonate != "undefined" && settings.data.disableattonate == 1){
				toggle_attonate_autoplay(true,true);
			}
		});
	});

	$(document).arrive("#watch7-sidebar-contents", {fireOnAttributesModification: true}, function() {
		getSettings(function(settings){
			if(typeof settings.data.disablelink != "undefined"){
				if(settings.data.disablelink == 1)
					$("#watch7-sidebar-contents").addClass("nosidebar");
				else
					$("#watch7-sidebar-contents").removeClass("nosidebar");
			}
			if(!arrived) insert_sidebar(settings);
		});
	});

	//Disable comments
	$(document).arrive(".comments-list", {fireOnAttributesModification: true}, function() {
		getSettings(function(settings){
			if(typeof settings.data.disablelink != "undefined"){
				if(settings.data.disablelink == 1)
					$(".comments-list").find("a").addClass('noclick');
				else
					$(".comments-list").find("a").removeClass('noclick');
			}
		});
	});

	//Disable replies
	$(document).arrive(".comment-item", {fireOnAttributesModification: true}, function() {
		getSettings(function(settings){
			if(typeof settings.data.disablelink != "undefined"){
				if(settings.data.disablelink == 1)
					$(".comment-item").parent().find("a").addClass('noclick');
				else
					$(".comment-item").parent().find("a").removeClass('noclick');
			}
		});
	});

	if(currentUrl.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)){
		
		getSettings(function(settings){
			console.log("currentUrl",settings);
			if(typeof settings.data.disablelink != "undefined"){
				if(settings.data.disablelink == 1)
					$("#watch7-sidebar-contents").addClass("nosidebar");
				else
					$("#watch7-sidebar-contents").removeClass("nosidebar");
			}
			if(typeof settings.data.disableattonate != "undefined"){
				if(settings.data.disableattonate == 1)
					toggle_attonate_autoplay(true,true);
				else
					toggle_attonate_autoplay(false,false);
			}
			
			if(!arrived) insert_sidebar(settings);
		});
	}

	$(document).on('click','#sidebarToggleBtn',function(){
		getSettings(function(settings){
			if(typeof settings.data.disablelink != "undefined"){
				if(settings.data.disablelink == 1){
					$("#sidebarToggleBtn").removeClass('open close').addClass("close");
					updateSettings({disablelink:0,disableattonate:settings.data.disableattonate});
					updatePageLinks(false);
				}
				else{
					$("#sidebarToggleBtn").removeClass('open close').addClass("open");
					updateSettings({disablelink:1,disableattonate:settings.data.disableattonate});
					updatePageLinks(true);
				}
			}
		});
	});

	function insert_sidebar(settings){
		arrived = true;
		var link_checked = (typeof settings.data.disablelink != "undefined" && settings.data.disablelink == 1)?"open":"close";
		$('<div id="truethemes-styling-preview">'
			+'<div id="sidebarToggleBtn" class="toggle-button '+link_checked+'"></div>'
			+'</div>').appendTo("body");
	}

	function updatePageLinks(flag){
		if(flag){
			$("#watch7-sidebar-contents").addClass("nosidebar");
	        $(".comments-list").find("a").addClass('noclick');
	        $(".comment-item").parent().find("a").addClass('noclick');
			$(document).arrive(".comments-list", {fireOnAttributesModification: true}, function() {
				$(".comments-list").find("a").addClass('noclick');
			});
			$(document).arrive(".comment-item", {fireOnAttributesModification: true}, function() {
				$(".comment-item").parent().find("a").addClass('noclick');
			});
		}else{
			$("#watch7-sidebar-contents").removeClass("nosidebar");
	    	$(".comments-list").find("a").removeClass('noclick');
	        $(".comment-item").parent().find("a").removeClass('noclick');
			$(document).arrive(".comments-list", {fireOnAttributesModification: true}, function() {
				$(".comments-list").find("a").removeClass('noclick');
			});
			$(document).arrive(".comment-item", {fireOnAttributesModification: true}, function() {
				$(".comment-item").parent().find("a").removeClass('noclick');
			});
		}
	}

	chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	  if (msg.action == 'update_ls_link') {
	  	getSettings(function(settings){
			if(typeof settings.data.disablelink != "undefined"){
				if(settings.data.disablelink == 1){
					$("#sidebarToggleBtn").removeClass('open close').addClass("close");
					updateSettings({disablelink:0,disableattonate:settings.data.disableattonate});
					updatePageLinks(false);
				}
				else{
					$("#sidebarToggleBtn").removeClass('open close').addClass("open");
					updateSettings({disablelink:1,disableattonate:settings.data.disableattonate});
					updatePageLinks(true);
				}
			}
			if(typeof settings.data.disableattonate != "undefined" && settings.data.disableattonate == 1){
				toggle_attonate_autoplay(true,true);
			}
		});
	  }
	});
});

function getSettings(callback){
	chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
	  callback(response);
	});
}

function updateSettings(args){
	chrome.runtime.sendMessage({method: "setStatus",data: args}, function(response) {
	  console.log(response);
	});
}

function send_to_BG(args,callback){
	chrome.runtime.sendMessage(args, function(response) {
		callback(response);
    });
}

function toggle_attonate_autoplay(attonate,autoplay){
	$(document).arrive(".ytp-settings-button", {fireOnAttributesModification: true}, function() {

	//activate the settings menu - without this we can't click anything else
   document.querySelectorAll(".ytp-settings-button").item(0).click();
   
   //autoplay
   if(autoplay && document.querySelectorAll("div[role='menuitemcheckbox']")[0].getAttribute("aria-checked") == "true")
       document.querySelectorAll("div[role='menuitemcheckbox']")[0].click();
   
   //annotations
   if(attonate && document.querySelectorAll("div[role='menuitemcheckbox']")[1].getAttribute("aria-checked") == "true")
       document.querySelectorAll("div[role='menuitemcheckbox']")[1].click();

   //Hide setting menu again
   document.querySelectorAll(".ytp-settings-button").item(0).click();
   });
}