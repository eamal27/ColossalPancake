(function() {

    var tweets = getAllTweets();

    console.log(tweets);

})();

function getAllTweets() {
    tweets = []
    $('div.content').each(function(i, x) {
        var tweet = $(x).find('p.tweet-text').text();
        tweets.push(tweet)
    });
    return tweets;
}



$('#stream-items-id').bind("DOMNodeInserted", function(e) {

    if (e.target.nodeName == 'Div') {
        console.log(e.target);
    }
});

