'use strict';

// chrome.devtools.network.onRequestFinished.addListener(function(req) {
//     // Displayed sample TCP connection time here
//    console.log(req.timings.connect);
// });

console.log("devtools.js: load");
chrome.devtools.panels.create("API recorder", "images/icon-38.png", "api-info.html", function (panel) {
	console.log("devtools.js chrome.devtools.panels.create");

	// win.$( document ).ready(function() {
	// 	console.log( "document.ready!" );

	// 	win.$.on('click', function(){
	// 		var return_str = '';
	// 		chrome.devtools.network.getHAR(function(result) {
	// 			console.log(result);
	// 			if (!result.entries.length) {
	// 				console.warn("Please reload page.");
	// 			}else{
	// 				for(var i=0; i<result.entries.length; i++) {
	// 					if(result.entries[i].request.url.indexOf(filter.value) > -1) {
	// 						return_str = return_str + result.entries[i].request.url + '\n';
	// 					}
	// 					//win.document.querySelector("#results").innerHTML = JSON.stringify(result.entries);

	// 				}
	// 				win.document.querySelector("#results").innerHTML = return_str;

	// 				//win.ace_editor.session.setMode('ace/mode/java');
	// 			}
	// 		});
	// 	});

	// });

	// panel.onShown.addListener(function(win) {

	// });

	// function xxxx() {

	// }

	// panel.onShown.addListener(function(win) {
	// 	console.log('i think this is the right onshow');
	// 	// var status = win.document.querySelector("#status");
	// 	// status.innerHTML = "Fixing to make magic.";

	// 	var log_network_data_btn = win.document.querySelector("#log-network-data-btn");
	// 	var filter = win.document.querySelector("#filter");

	// 	log_network_data_btn.addEventListener("click", function(){
	// 		var return_str = '';
	// 		chrome.devtools.network.getHAR(function(result) {
	// 			console.log(result);
	// 			if (!result.entries.length) {
	// 				console.warn("Please reload page.");
	// 			}else{
	// 				for(var i=0; i<result.entries.length; i++) {
	// 					if(result.entries[i].request.url.indexOf(filter.value) > -1) {
	// 						return_str = return_str + result.entries[i].request.url + '\n';
	// 					}
	// 					//win.document.querySelector("#results").innerHTML = JSON.stringify(result.entries);

	// 				}
	// 				win.document.querySelector("#results").innerHTML = return_str;

	// 				//win.ace_editor.session.setMode('ace/mode/java');
	// 			}
	// 		});
	// 	});

	// 	chrome.devtools.network.getHAR(function(result) {
	// 		console.log(result);
	// 		var entries = result.entries;
	// 		if (!entries.length) {
	// 			console.warn("Please reload page.");
	// 		}
	// 	});

	// });
});