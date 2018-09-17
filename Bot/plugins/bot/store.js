var Promise = require('bluebird');
var ReviewsOptions = [
    
    '“good approach to new technologies”',
    '“Need more attention to little things”',
    '“Lovely small app ideally situated to explore the college.”',
    '“Positive surprise”',
    '“Beautiful UI”'];

module.exports = {

searchBotReviews: function () {
    return new Promise(function (resolve) {

        // Filling the review results manually just for demo purposes
        var reviews = [];
        for (var i = 0; i < 5; i++) {
            reviews.push({
                title: ReviewsOptions[Math.floor(Math.random() * ReviewsOptions.length)],
                text: 'Very nice application.',
                image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif'
            });
        }

        // complete promise with a timer to simulate async response
        setTimeout(function () { resolve(reviews); }, 1000);
    });
}
};

