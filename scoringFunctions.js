

function getRedditScore(submission_id, callback) {
    var serverUrl = 'https://massive-waffle.herokuapp.com/reddit/'
    $.getJSON(server_url + submission_id, function( data ) {
        callback(submission_id, data)
    }); 
}

function getHNScore(submission_id, callback) {
    var serverUrl = 'https://massive-waffle.herokuapp.com/hn/'
    $.getJSON(server_url + submission_id, function( data ) {
        callback(submission_id, data)
    }); 
}
