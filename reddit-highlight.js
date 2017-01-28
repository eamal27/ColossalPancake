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
				var rp = $(this);
				var rp_id = getPostId(rp);
				var rp_color = getPostColor(rp_id);
				rp
						.css("position","relative")
						.append("<div class='sbar' id='"+rp_id+"'></div");

				var rp_meter = rp.find(".sbar");
				rp_meter.css({
				//						"background": rp_color,
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
						console.log(rp_id + ":" + (result.score || "noresult"));
						rp_meter.css("background",getPostColor(result.score));
				});

		});
}

function getPostId(e) {
		var id = e.attr('class');
		id_ = id.split("id-t3_");
		id__ = id_[1].split(" ");

		return id__[0]
}

function getPostColor(rp_score) {
		var score = (rp_score + 1) /2;
		return d3.interpolateRdBu(score)
}

function getRedditScore(submissionId, callback) {
		var serverUrl = 'https://massive-waffle.herokuapp.com/reddit/'
		$.getJSON(serverUrl + submissionId, function( data  ) {
				callback(data)
		}); 
}
