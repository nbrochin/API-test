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


function getRequest(q, token){
  var params = {
    q: q,
    part:'snippet',
    key:'AIzaSyDhcv5fxPkNS9EpFfuhJryGtMike4zwOPE',
    maxResults:15,
    pageToken:token,
  };

    

  url = 'https://www.googleapis.com/youtube/v3/search';

  $.getJSON(url, params, function(data){
    showResults(data.items);
    $('#pageTokenNext').data('token', data.nextPageToken);
    $('#pageTokenPrev').data('token', data.prevPageToken);

    
    $('#total-results-container').html('Total Results: ' + data.pageInfo.totalResults);

  });
}

  $("#pageTokenNext").on( "click", function(event) {
  	var q = $('#query').val();
  	getRequest(q,$('#pageTokenNext').data('token'));

  });

  $("#pageTokenPrev").on( "click", function( event ) {
  	var q = $('#query').val();
  	getRequest(q,$('#pageTokenPrev').data('token'));
  });



  // }); 



function showResults(results){
  var thumbs = "";
  $.each(results, function(index,ytdata){
  	  var vTitle = ytdata.snippet.title;
  	  var truncatedText = jQuery.trim(vTitle).substring(0, 50)
  	  .split(" ").slice(0, -1).join(" ") + "...";


    thumbs += '<p class="thumb-spacing"><a href="https://www.youtube.com/watch?v=' + ytdata.id.videoId + '"><img src ="' + ytdata.snippet.thumbnails.medium.url + '"/></a>' + '<br /><span class="video-title">' + truncatedText + '</span></p>';
    // console.log(video.snippet.thumbnails.medium.url);
    // console.log(ytdata.nextPageToken);
    // console.log(video.snippet.vTitle);
  });

  $('#search-results').html(thumbs);

}

});
