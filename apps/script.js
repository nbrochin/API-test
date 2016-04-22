$(document).ready(function() {
  youtubeApiCall();
  $("#pageTokenNext").on( "click", function( event ) {
   $("#pageToken").val($("#pageTokenNext").val());
   youtubeApiCall();
  });
  $("#pageTokenPrev").on( "click", function( event ) {
   $("#pageToken").val($("#pageTokenPrev").val());
   youtubeApiCall();
  }); 
});


function youtubeApiCall(){
    var video = $(location).attr('href').split('v=')[1];
    $.ajax({
        cache: false,
        data: $.extend({
            key: 'AIzaSyDhcv5fxPkNS9EpFfuhJryGtMike4zwOPE',
            relatedToVideoId: video,
            part: 'snippet',
            type:'video'
        }, {maxResults:20,pageToken:$("#pageToken").val()}),
        dataType: 'json',
        type: 'GET',
        timeout: 5000,
        url: 'https://www.googleapis.com/youtube/v3/search'
    })
    .done(function(data) {
        if (typeof data.prevPageToken === "undefined") {$("#pageTokenPrev").hide();}else{$("#pageTokenPrev").show();}
        if (typeof data.nextPageToken === "undefined") {$("#pageTokenNext").hide();}else{$("#pageTokenNext").show();}
        var items = data.items, videoList = "";
        $("#pageTokenNext").val(data.nextPageToken);
        $("#pageTokenPrev").val(data.prevPageToken);
        $.each(items, function(index,e) {
            videoList = videoList + '<li class="hyv-video-list-item"><div class="hyv-content-wrapper"><a href="?v='+e.id.videoId+'" class="hyv-content-link" title="'+e.snippet.title+'"><span class="title">'+e.snippet.title+'</span><span class="stat attribution">by <span>'+e.snippet.channelTitle+'</span></span></a></div><div class="hyv-thumb-wrapper"><a href="?v='+e.id.videoId+'" class="hyv-thumb-link"><span class="hyv-simple-thumb-wrap"><img alt="'+e.snippet.title+'" src="'+e.snippet.thumbnails.default.url+'" width="120" height="90"></span></a></div></li>';
        });
        $("#hyv-watch-related").html(videoList);
        // JSON Responce to display for user
        
    });
}