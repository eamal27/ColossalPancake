
var serverUrl = 'localhost:5000/reddit/'

function(submission_id, callback) {
    $.get(server_url + submission_id, function( score ) {
        callback(submission_id, score)
    }); 
}
