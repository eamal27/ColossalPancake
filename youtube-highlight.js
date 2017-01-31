(function() {
    const API_URL = "https://commentsentiment.objectivetruth.ca/score_comment";
    const shouldLogOutput = true;

    // Set a listener for changing page (specifically for youtube because its single page app)
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("URL CHANGED: " + request.data.url);
        window.setTimeout(prepareListeners, 1500);
    });

    let observeDOM = (function(){
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){
                // define a new observer
                let obs = new MutationObserver(function(mutations, observer){
                    if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { childList:true, subtree:true });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    //=============================
    //=============================
    //=============================

    function prepareListeners() {
        let watchDiscussion = document.getElementById("watch-discussion");
        console.log(watchDiscussion);

        if(watchDiscussion) {
            observeDOM(watchDiscussion, function(){
                let allComments = document.getElementsByClassName("comment-renderer-text-content");
                for(let comment of allComments) {
                    if(hasCommentNOTBeenLoadedBefore(comment)) {
                        let commentText = comment.innerText;
                        if (shouldLogOutput) {
                            console.log(commentText);
                        }

                        postData(API_URL, commentText, function (result) {
                            result = result || {};
                            let elipsisComment = elipsizeString(commentText);
                            if (shouldLogOutput) {
                                console.log(elipsisComment + ": " + (result.score || "noresult"));
                            }
                            comment.style.backgroundColor = getPostColor(result.score);
                            markCommentAsCompleted(comment);
                        });
                    }
                }
            });
        }
    }

    function hasCommentNOTBeenLoadedBefore(comment) {
        return !comment.attributes["is-sentiment-complete"] || comment.attributes["is-sentiment-complete"].textContent != "true";

    }

    function markCommentAsCompleted(comment) {
        if(!comment.attributes["is-sentiment-complete"]) {
            comment.setAttribute("is-sentiment-complete", "true");
        }
    }

    function getPostColor(rp_score) {
        if(rp_score == null) {
            if(shouldLogOutput) {console.log("No valid result returned, using gray");}
            return "rgb(224,224,224)";
        }

        return getColorFromValue(rp_score)
    }

    function elipsizeString(comment) {
        const MAX_COMMENT_SIZE = 50;
        if(comment.length < MAX_COMMENT_SIZE) {
            return comment;
        }else{
            return comment.substr(0, MAX_COMMENT_SIZE) + "...";
        }
    }


    function postData(url, commentText, callbackFunc) {
        try {
            let formDataBody = "comment=" + encodeURIComponent(commentText);
            let request = new XMLHttpRequest();

            request.onreadystatechange = function(currentRequestState) {
                if(request.readyState == 4 && request.status == 200) {
                    let responseText = currentRequestState.target.responseText;
                    let returnedJSON = JSON.parse(responseText);
                    callbackFunc(returnedJSON);
                }else if(request.readyState == 4) {
                    if(shouldLogOutput) {console.log("status is " + request.status);}
                    callbackFunc(null);
                }
            };
            request.open('POST', url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(formDataBody);
        }
        catch (e) {
            if(shouldLogOutput) {console.log("Request Failed", e);}
        }

    }

})();
