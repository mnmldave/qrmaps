/*
 * qrmaps.js
 * dave.heaton@gmail.com
 *
 * Content script that adds a "Code" link to Google Maps pages which, when
 * clicked, displays a QR code linking to the location currently being viewed.
 *
 * Copyright 2010 Dave Heaton
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// store the link element, whose href is used in generating the code
var link = $("#link");

// create Container window (for popup)
var container = $("<div>")
	.attr('id', 'qrcode_container')
	.hide()
	.click(function() { container.fadeOut('fast'); })
	.appendTo($('#inner'));
	
// hide Container whenever user presses a key
$(window).keyup(function(event) { container.fadeOut('fast'); })

function container_show(url) {
	var help = $('<a>')
		.attr('href', chrome.extension.getURL('help.html'))
		.attr('target', '_blank')
		.append($('<img>').attr('src', chrome.extension.getURL('question-white.png')));

	var image = $('<img>')
		.attr('id', 'qrcode_image')
		.attr('src', 'http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=' + encodeURIComponent(url));

	var content = $('<div>')
		.attr('id', 'qrcode_content')
		.append($('<div>').attr('id','qrcode_help').append(help))
		.append($('<div>').append(image));

	// clear container, insert the new image, fade it in
	container.empty();
	container.append(content);
	container.fadeIn('fast');
}

// create Code link
var code = $('<a id="qrcode" href="#">')
	.append($('<img>').addClass("bar-icon").attr('src', chrome.extension.getURL("code.png")))
	.append($('<span>').addClass("link-text").text('Code'))
	.click(function() {
		var long_url = link.attr('href');
		
		if (long_url.length > 256) {
			var loader = $('<div>')
				.attr('id', 'qrcode_content')
				.append($('<div>').attr('id', 'qrcode_loader').append($('<img>').attr('src', chrome.extension.getURL('ajax-loader.gif'))));
				
			container.empty();
			container.append(loader);
			container.fadeIn('fast');
			
			chrome.extension.sendRequest({
				action: 'shortenUrl', 
				options: {
					url: long_url
				}
			}, function(data) {
				container_show(data['short_url']);
			});
		} else {
			container_show(long_url);
		}
		
		return false;
	});

// add Code link to the toolbar
link.after(code);
link.after(' <img src="http://maps.gstatic.com/intl/en_ALL/mapfiles/transparent.png" class="bar-icon-divider bar-divider" jstcache="0"> ');