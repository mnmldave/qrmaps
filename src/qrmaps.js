/*!
 * Copyright (c) 2010-2011 Dave Heaton.
 * Freely distributable under the MIT license.
 */

(function($) {
  // store the link element, whose href is used in generating the code
  var link = $("#link"),
      dialog = $("<div>")
          .attr('id', 'qrmaps-dialog')
          .hide()
          .click(function() { $(this).fadeOut('fast'); })
          .appendTo($('#inner'));

  var showDialog = function(url) {
    dialog.empty();
    
    if (url.length > 256) {
      // shorten url and call recursively
      var loader = $('<div>', { id: 'qrmaps-content' })
          .append($('<div>', { id: 'qrmaps-loader' })
              .append($('<img>', { src: chrome.extension.getURL('ajax-loader.gif') })));

      dialog.append(loader);
      chrome.extension.sendRequest({
            action: 'shortenUrl', 
            options: {
              url: url
            }
          }, function(data) { showDialog(data['short_url']); });
    } else {
      // turn url into qrcode
      var help = $('<a>', { href: chrome.extension.getURL('help.html'), target: '_blank' })
              .append($('<img>', { src: chrome.extension.getURL('question-white.png') })),
          content = $('<div>', { id: 'qrmaps-content' })
              .append($('<div>', { id: 'qrmaps-help' }).append(help))
              .append($('<div>').append($('<img>', { id: 'qrmaps-image', src: 'http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=' + encodeURIComponent(url) })));
      dialog.append(content);
      $(window).one('keyup', function(event) { dialog.fadeOut('fast'); });
    }
    
    dialog.fadeIn('fast');
  };

  // create Code link
  var code = $('<a>', { id: 'qrmaps', href: '#', 'class': 'kd-button right small' })
      .append($('<img>').addClass("bar-icon").attr('src', chrome.extension.getURL("code.png")))
      .click(function() { showDialog(link.attr('href')); return false; });
  
  link.removeClass('right').addClass('mid');
  link.parent().width(142);
  link.parent().append(code);

})(jQuery);
