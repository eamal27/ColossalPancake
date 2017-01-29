(function() {
    const API_URL = "https://massive-waffle.herokuapp.com/hn/";
    const isDEVELOPMENT = false;
    const shouldLogOutput = true;

    if(isDEVELOPMENT) {
        document.body.innerHTML = "<div><h2>DEVELOPMENT MODE</h2></div>" + document.body.innerHTML
    }

    let allStoryTableRows = document.getElementsByClassName("athing");
    for(let storyTR of allStoryTableRows) {
        let storyId = storyTR.attributes.id.textContent;
        if(shouldLogOutput) {console.log(storyId);}
        getXMLAndExecFunction(API_URL + storyId, function(result) {
            result = result || {};
            if(shouldLogOutput) {console.log(storyId + ":" + (result.score || "noresult"));}

            storyTR.style.backgroundColor = getColorFromValue(result.score);
        });
    }
    if(shouldLogOutput) {console.log("Getting the first ID: " + allStoryTableRows[0].attributes.id.textContent);}

    /**
     * Takes a url to hit and a callback function to execute, the value passed to the callback will be the JSON object
     * @param url
     * @param callbackFunc Optional
     */
    function getXMLAndExecFunction(url, callbackFunc)  {
        if(isDEVELOPMENT) {
            window.setTimeout(function() {
                callbackFunc(generateRandomValueResponseFromAPIForDevelopment())
            }, generateRandomValueBetween(200, 5000));
            return;
        }

        try {
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
            request.open('GET', url, true);
            request.send(null);
        }
        catch (e) {
            if(shouldLogOutput) {console.log("Request Failed", e);}
        }
    }

    function generateRandomValueResponseFromAPIForDevelopment() {
        const RANDOMIZER_MAX_VALUE = 1;
        const RANDOMIZER_MIN_VALUE = -1;

        return {
            score: generateRandomValueBetween(RANDOMIZER_MIN_VALUE, RANDOMIZER_MAX_VALUE)
        };
    }

    function generateRandomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function convertResultToValueBetween0And100(result) {
        return (result + 1) * 50;
    }
})();
