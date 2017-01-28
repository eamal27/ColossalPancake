$( document  ).ready(function() {

	init();

});

function init() {
	console.log("highlight begin");
	addSentimentBars();

}

function addSentimentBars() {
	var reddit_posts = $(".thing");

	reddit_posts.each(function() {
		$(this).css("position","relative");
		$(this).append("<div class='sbar' id='"+getPostId($(this))+"'></div");
	});

	var sentiment_meters = $(".sbar");
	sentiment_meters.each(function() {
		$(this).css({
			"background": "chartreuse",
			"width": "8px",
			"height": "100%",
			"position": "absolute",
			"top": "0",
			"left": "-4px"
		});

		if($(this).parent().hasClass("reddit-link")) {
			$(this).css({
				"width": "4px",
				"left": "-5px"
			});
		}
	});
}

function getPostId(e) {
	var id = e.attr('class');
	id_ = id.split("id-t3_");
	id__ = id_[1].split(" ");
	
	return id__[0]
}

function getRedditScore(submission_id, callback) {
	var serverUrl = 'https://massive-waffle.herokuapp.com/reddit/'
	$.getJSON(server_url + submission_id, function( data  ) {
		callback(data)
	}); 
}

