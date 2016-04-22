$(document).ready(function(){

// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

$(function(){
  $('#search-term').submit(function(event){
    event.preventDefault();
    var q = $('#query').val();
    getRequest(q);
   $('li.topic-title').html(q);
  });
});


function getRequest(q){
  var nextPageToken = 0;
  var prevPageToken = 0;
  var params = {
    q: q,
    part:'snippet',
    key:'AIzaSyDhcv5fxPkNS9EpFfuhJryGtMike4zwOPE',
    maxResults:20,
 	pageToken:
  };

  url = 'https://www.googleapis.com/youtube/v3/search';

  $.getJSON(url, params, function(data){
    showResults(data.items);
  });
}

getRequest();
  $("#pageTokenNext").on( "click", function( event ) {
   $("#pageToken").val($("#pageTokenNext").val());
   getRequest();
  });
  $("#pageTokenPrev").on( "click", function( event ) {
   $("#pageToken").val($("#pageTokenPrev").val());
   getRequest();
  }); 


function showResults(results){
  var thumbs = "";
  $.each(results, function(index,ytdata){
  	  var vTitle = ytdata.snippet.title;
  	  var truncatedText = jQuery.trim(vTitle).substring(0, 50)
  	  .split(" ").slice(0, -1).join(" ") + "...";

    thumbs += '<p class="thumb-spacing"><a href="https://www.youtube.com/watch?v=' + ytdata.id.videoId + '"><img src ="' + ytdata.snippet.thumbnails.medium.url + '"/></a>' + '<br /><span class="video-title">' + truncatedText + '</span></p>';
    // console.log(video.snippet.thumbnails.medium.url);
    console.log(ytdata.snippet);
    // console.log(video.snippet.vTitle);
  });

  $('#search-results').html(thumbs);
}

// Define some variables used to remember state.
var playlistId, nextPageToken, prevPageToken;

// After the API loads, call a function to get the uploads playlist ID.
function handleAPILoaded() {
  requestUserUploadsPlaylistId();
}

// Call the Data API to retrieve the playlist ID that uniquely identifies the
// list of videos uploaded to the currently authenticated user's channel.
function requestUserUploadsPlaylistId() {
  // See https://developers.google.com/youtube/v3/docs/channels/list
  var request = gapi.client.youtube.channels.list({
    mine: true,
    part: 'contentDetails'
  });
  request.execute(function(response) {
    playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
    requestVideoPlaylist(playlistId);
  });
}

// Retrieve the list of videos in the specified playlist.
function requestVideoPlaylist(playlistId, pageToken) {
  $('#video-container').html('');
  var requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    maxResults: 10
  };
  if (pageToken) {
    requestOptions.pageToken = pageToken;
  }
  var request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {
    // Only show pagination buttons if there is a pagination token for the
    // next or previous page of results.
    nextPageToken = response.result.nextPageToken;
    var nextVis = nextPageToken ? 'visible' : 'hidden';
    $('#next-button').css('visibility', nextVis);
    prevPageToken = response.result.prevPageToken
    var prevVis = prevPageToken ? 'visible' : 'hidden';
    $('#prev-button').css('visibility', prevVis);

    var playlistItems = response.result.items;
    if (playlistItems) {
      $.each(playlistItems, function(index, item) {
        displayResult(item.snippet);
      });
    } else {
      $('#video-container').html('Sorry you have no uploaded videos');
    }
  });
}

// Create a listing for a video.
function displayResult(videoSnippet) {
  var title = videoSnippet.title;
  var videoId = videoSnippet.resourceId.videoId;
  $('#video-container').append('<p>' + title + ' - ' + videoId + '</p>');
}

// Retrieve the next page of videos in the playlist.
function nextPage() {
  requestVideoPlaylist(playlistId, nextPageToken);
}

// Retrieve the previous page of videos in the playlist.
function previousPage() {
  requestVideoPlaylist(playlistId, prevPageToken);
}

});
