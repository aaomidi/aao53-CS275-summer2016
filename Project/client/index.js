load(document, "final-project", function () {
    getZipcode();
    $("#tweetForm").submit(function (event) {
        submitTweet();
        event.preventDefault();
        event.stopPropagation();
    });
});