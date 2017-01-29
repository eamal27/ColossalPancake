$( document  ).ready(function() {
		init();
});

$("document").on( "neverEndingLoad", function( event ) {
		console.log("tree changed");
});

function init() {
		console.log("highlight begin");
		addSentimentBars();

}

function addSentimentBars() {
var reddit_posts = $(".thing");

		if($("body").hasClass("listing-page")) {
				reddit_posts.each(function() {
						var rp = $(this);
						if(!rp.hasClass("sentiment")) {
								var rp_id = getPostId(rp);
								var rp_color = getColorFromValue(rp_id);
								rp
										.css("position","relative")
										.append("<div class='sbar' id='"+rp_id+"'></div");

								var rp_meter = rp.find(".sbar");
								rp_meter.css({
										"width": "7px",
										"height": "100%",
										"position": "absolute",
										"top": "0",
										"left": "-4px"
								});

								if(rp_meter.parent().hasClass("reddit-link")) {
										rp_meter.css({
												"width": "4px",
												"left": "-5px"
										});
								}

								getRedditScore(rp_id, function(result) {
										result = result || {};
										console.log(rp_id + ":" + (result.score ));
										rp_meter.css("background",getColorFromValue(result.score));
								});
								
								rp.addClass("sentiment");
						}		
				});
		}

		if($("body").hasClass("comments-page")) {
				var comments = $(".comment");
				comments.each(function(){
						var comment = $(this);
						var commentStr = $(this).find(".md").text();
						getCommentScore(commentStr, function(result) {
								result = result || {};
								comment.find(".entry").css({
										"background": getColorFromValue(result.score),
										"border-radius": "12px",
										"padding": "5px"
								});
								console.log("\n\n" + commentStr + "\n" + result.comment + "\n" + result.score)
						});
				});
		}
}

function getPostId(e) {
		var id = e.attr('class');
		id_ = id.split("id-t3_");
		id__ = id_[1].split(" ");

		return id__[0]
}

function getRedditScore(submissionId, callback) {
		var serverUrl = 'https://massive-waffle.herokuapp.com/reddit/'
		$.getJSON(serverUrl + submissionId, function( data  ) {
				callback(data);
		}); 
}

function getCommentScore(commentStr, callback) {
		var serverUrl = 'https://massive-waffle.herokuapp.com/score_comment'
		$.post( serverUrl, { comment: commentStr }, function( data  ) {
				  callback(data);
		});
}
