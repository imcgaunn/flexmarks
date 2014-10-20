// do some fuzzy matching on bookmarks.

var nodes = [];
$(function() {
  $('#search').keypress(function(kp) {
    // clear our nodes array every time
    // so we don't keep adding to the same nodes array
    // every time we search.

    // if user hits enter, open the first url listed
    // in the bookmarks div
    if (kp.which == 13) {
      var tabopts = {
        url: $("#bookmarks a").first().attr("href")
      }
      chrome.tabs.create(tabopts);
    }

    else {
      nodes = []
      $('#bookmarks').empty();
      dumpBookmarks($('#search').val());
    }
  });
});

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      if (query === undefined) {
        query = '';
      }

      flattenNodes(bookmarkTreeNodes);

      var options = {
        keys: ['title'],
        shouldSort: true,
        includeScore: true,
        threshold: 0.3 // make sure match is <= 0.3
      };

      var f = new Fuse(nodes, options);
      var res = f.search(query);

      res.forEach(function(val, idx, ar) {
        var bmark = $("<a>");
        bmark.attr("href", val.item.url);
        bmark.text(val.item.title);
        $('#bookmarks').append(bmark);
      });

    });
}

function flattenNodes(bookmarkNodes) {
  for (var i = 0; i < bookmarkNodes.length; i++) {
    if (bookmarkNodes[i].children) {
      flattenNodes(bookmarkNodes[i].children);
    }
    nodes.push(bookmarkNodes[i]);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("search").focus();
  dumpBookmarks();
});
