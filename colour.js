function getColorFromValue(s) {
		var score = (s + 1) /2;
		return d3.interpolateRdBu(score)
}
