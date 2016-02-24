'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

String.prototype.capitalize = function () {
	return this.replace(/(?:^|\s)\S/g, function (a) {
		return a.toUpperCase();
	});
};

function getType(value) {
	return (typeof value === 'undefined' ? 'undefined' : _typeof(value)).capitalize();
}

$(document).ready(function () {

	var request_editor = ace.edit('request');
	request_editor.setTheme('ace/theme/vibrant_ink');
	request_editor.getSession().setMode('ace/mode/java');

	var response_editor = ace.edit('response');
	response_editor.setTheme('ace/theme/vibrant_ink');
	response_editor.getSession().setMode('ace/mode/java');

	var assert_editor = ace.edit('assert');
	assert_editor.setTheme('ace/theme/vibrant_ink');
	assert_editor.getSession().setMode('ace/mode/java');

	// list_network_requests(request_editor);
	// $('#log-network-data-btn').on('click', list_network_requests);

	$('#clear').on('click', function (e) {
		$('#request-list').empty();
	});

	$('#request-list').on('click', 'li', function (e) {
		//console.log(e.target.network_data);
		if (e.target.network_data.request.postData) {
			request_editor.setValue(finish(e.target.network_data.request.postData.text), -1);
		}
		response_editor.setValue(finish(e.target.network_data.response_body), -1);
		assert_editor.setValue(create_assert(e.target.network_data.response_body), -1);
	});
	// request_editor.setValue(create_request(e.target.network_data));
	// response_editor.setValue(create_response(e.target.network_data));
	// assert_editor.setValue(create_assert(e.target.network_data));

	if (chrome.devtools) {
		chrome.devtools.network.onRequestFinished.addListener(function (har_entry) {
			if (har_entry.request.url.indexOf(filter.value) > -1) {
				var li = $('<li>').text(har_entry.request.method + ': ' + har_entry.request.url);
				li[0].network_data = har_entry;
				har_entry.getContent(function (response_body) {
					li[0].network_data.response_body = JSON.parse(response_body);
				});
				$('#request-list').append(li);
			}
		});
	}
});



function create_assert(network_data) {
	var assert_java_code = 'betFailure = BetFailures.builder()\n';
	for(prop in network_data) {
		if(typeof network_data[prop] !== 'object') {
			assert_java_code = assert_java_code + '.' + prop + '(' + network_data[prop] + ');' + '\n';
		} else{
			
		}
	}
	return assert_java_code + '.build();\n';
}


// function create_request(network_data) {
// 	var request = '';
// 	var post_data = null;
// 	var req_method = network_data.request.method.toLowerCase().capitalize();
// 	var class_name = 'BlackBookAddFavourites';

// 	// request = request + 'package com.sportsbet.automation.acs.user.request;' + '\n';
// 	// request = request + 'import com.google.common.base.Optional;' + '\n';
// 	// request = request + 'import com.paddypower.automation.jsontester.ValidationFailedException;' + '\n';
// 	// request = request + 'import com.sportsbet.automation.api.common.core.sender.GetMessageSender;' + '\n';
// 	// request = request + 'import com.sportsbet.automation.api.common.core.session.ApiRequestBase;' + '\n';
// 	// request = request + 'import com.sportsbet.automation.api.common.core.session.ApiSessionFactory;' + '\n';
// 	// request = request + 'import com.sportsbet.automation.api.common.core.session.Headers;' + '\n';
// 	// request = request + 'import com.sportsbet.automation.acs.user.response.BetsGetResponse;' + '\n';
// 	request = request + '' + '\n';

// 	request = request + 'public class ' + class_name + 'Request extends ApiRequestBase<' + class_name + 'Request> (';

// 		// eg: String name;
// 		if(network_data.request.postData) {
// 			var post_data = JSON.parse(network_data.request.postData.text);
// 			for(prop in post_data) {
// 				request = request + '	private String ' + prop + ';' + '\n';
// 			}
// 			request = request + '' + '\n';
// 		}

// 		// Constructor
// 		request = request + 'public ' +  class_name + req_method + 'Request(';
// 		if(network_data.request.postData) {
// 			var post_data = JSON.parse(network_data.request.postData.text);
// 			for(prop in post_data) {
// 				request = request + getType(post_data[prop]) + ' ' + prop + ', ';
// 			}
// 		}
// 		request = request + 'ApiSessionFactory factory) {' + '\n';

// 			request = request + '		super(factory.setHttpProtocol(new ' + req_method + 'MessageSender()), System.getProperty("acs.api.url") + "/' + network_data.request.url.split('/').slice(3).join('/') + '");' + '\n';
// 			// Setter
// 			if(network_data.request.postData) {
// 				var post_data = JSON.parse(network_data.request.postData.text);
// 				for(prop in post_data) {
// 					request = request + '		this.' + prop + ' = ' + prop + ';\n';
// 				}
// 				request = request + '' + '\n';
// 			}

// 		request = request + '}' + '\n';

// 		// send
// 		// public BlackBookAddFavouritesResponse send() throws ValidationFailedException {
// 		// 	BlackBookAddFavouritesResponse response = getSessionFactory().send(this, BlackBookAddFavouritesResponse.class);

// 		// 	Optional<String> allowOriginHeader = response.getHeader(Headers.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN);
// 		// 	if (allowOriginHeader.isPresent()) {
// 		// 		getSessionFactory().setPersistentHeader(Headers.HEADER_ORIGIN, allowOriginHeader.get());
// 		// 	}

// 		// 	return response;
// 		// }

// 	request = request + '}' + '\n';

// 	return request;

// }

// function create_response(network_data) {
// 	var response = '';

// 	return response;
// }
// function create_assert(network_data) {
// 	var assert = '';

// 	return assert;
// }

// function list_network_requests(request_editor) {

// 	if(chrome.devtools) {

// 		chrome.devtools.network.getHAR(function(result) {
// 			$('#request-list').empty();

// 			//console.log(result);
// 			if (!result.entries.length) {
// 				console.warn("Please reload page.");
// 			}else{
// 				for(var i=0; i<result.entries.length; i++) {
// 					if(result.entries[i].request.url.indexOf(filter.value) > -1) {

// 						var li = $('<li>').text(result.entries[i].request.method + ': ' + result.entries[i].request.url);
// 						li[0].network_data = result.entries[i];
// 						result.entries[i].getContent(function(body){
// 							li[0].network_data.response_body = JSON.parse(body);
// 						});
// 						$('#request-list').append(li);
// 					}
// 				}
// 			}
// 		});	
// 	}else{
// 		var json = '{ "firstBet":false, "accountBalance":{ "currency":"AUD", "balance":393803.03, "availableFunds":393803.03, "withdrawableFunds":2102.67 }, "pendingBetCount":136, "betPlacements":[ { "betNo":1451, "betId":400022440, "receipt":"O/2024463/0000399/D", "numLines":1, "currency":"AUD", "totalStake":10.00, "cashoutAvailable":false, "betPotentialWin":"385.82", "betItems":[ { "betId":400022440, "date":1455573630, "ipaddr":"10.31.22.105", "source":"M", "stake":10.00, "tokenValue":"0.00", "taxType":"S", "tax":0.00, "winnings":0.00, "refund":0.00, "taxRate":0.00, "status":"A", "settled":false, "numSelns":1, "numLegs":1, "numLines":1, "numLinesVoid":0, "numLinesWin":0, "numLinesLose":0, "receipt":"O/2024463/0000399/D", "paid":true, "uniqueId":"0bfec065ccb2556a64a5579c23219", "stakePerLine":10.00, "betType":"SGL", "betTypeName":"Single", "legs":[ { "legNo":1, "legSort":"--", "legType":"W", "parts":[ { "partNo":1, "outcome":213322659, "priceType":"L", "priceNum":37582, "priceDen":1000, "fbResult":"-", "description":"|Sir Dots-a-lot|", "runnerNum":1, "eventTypeDesc":"|Test Automation|", "eventId":2481690, "eventDesc":"R1 LP Only", "startTime":1455618710, "marketId":36155816, "eventMarketDesc":"|Win or Place|", "eventMarketSort":"--", "eventClassName":"|Horse Racing: Asia|", "result":"-", "resultConf":"N", "priceDecimal":38.58 } ] } ] } ] } ], "queuedStatus":{ "code":"1", "description":"Processed" } }';
// 		request_editor.setValue(finish(json));
// 	}
// }

// chrome.tabs.onUpdated.addListener(function (tabId, changes, tabObject) {
//   console.log("Status of", tabId, "is", changes.status);
//   if (changes.status == "complete") {
//     console.log("Tab Load Complete");
//   }
// });