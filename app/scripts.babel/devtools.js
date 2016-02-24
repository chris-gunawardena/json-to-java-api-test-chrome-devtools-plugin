'use strict';

// chrome.devtools.network.onRequestFinished.addListener(function(req) {
//     // Displayed sample TCP connection time here
//    console.log(req.timings.connect);
// });

console.log("devtools.js: load");
chrome.devtools.panels.create("API recorder", "images/icon-38.png", "api-info.html",  function(panel) {
	console.log("devtools.js chrome.devtools.panels.create");
});

