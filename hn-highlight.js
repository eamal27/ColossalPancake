(function() {
    const API_URL = "https://massive-waffle.herokuapp.com/hn/";
    const isDEVELOPMENT = false;
    const shouldLogOutput = true;
    const useD3 = true;

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

            storyTR.style.backgroundColor = useD3 ? getPostColor(result.score) : getColorRGBFromValue(result.score);
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

    function getPostColor(rp_score) {
        let score = (rp_score + 1) /2;
        let interpolatedRGBColor = d3.interpolateRdBu(score);
        return interpolatedRGBColor;
    }

    function getColorRGBFromValue(result) {
        if(result == null) {
            if(shouldLogOutput) {console.log("No valid result returned, using gray");}
            return "rgb(224,224,224)";
        }
        let interpolatedResult = convertResultToValueBetween0And100(result);
        if(shouldLogOutput) {console.log("Interpolated[0, 100]: " + interpolatedResult);}
        let r, g, b;

        if (interpolatedResult <= 50) {
            r = Math.floor((255 * (interpolatedResult / 50)));
            g = 255;
            b = Math.floor((255 * (interpolatedResult / 50)));
        }
        else {
            r = 255;
            g = Math.floor((100 - interpolatedResult) / 50 * 255);
            b = Math.floor((100 - interpolatedResult) / 50 * 255);
        }
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    function convertResultToValueBetween0And100(result) {
        return (result + 1) * 50;
    }
})();