function getColorFromValue(s) {
    var percent = (s+1)/2.0;
    var range = 0.5;
    var base = 0.25;
    var score = base + percent*range;
    return d3.interpolateRdBu(score);
}
