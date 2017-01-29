(function() {

    var reviews = getAllAmazonReviews();

    console.log(reviews);

})();

function getAllAmazonReviews() {
    reviews = []
    $('div.a-row.a-spacing-small').each(function(i, x) {
        reviews.push(x);
    });
    return reviews;
}
