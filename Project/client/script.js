var zipcode = 12345;

function getZipcode() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);

            var long = position.coords.longitude;
            var lat = position.coords.latitude;

            var url = 'https://project.aaomidi.com/api/get';
            var data = {
                type: "getZip",
                lat: lat,
                long: long
            };
            $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                dataType: "json",
                success: zipcode_callback,
                error: error
            });
        });
    } else {
        console.warn("Since you didn't allow us to get your zipcode. We will be using 10000 as your default zipcode.");
    }
}
function loadTweets() {
    var url = 'https://project.aaomidi.com/api/get';
    var data = {
        type: "get",
        zipcode: zipcode,
        count: 8
    };

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json",
        success: tweet_callback,
        error: error
    });

}
function tweet_callback(json) {
    for (var i in json.messages) {
        console.log(json.messages[i]);
        $("#tweetRow").append("<div>" + json.messages[i] + "</div>");
    }
}
function zipcode_callback(json) {
    console.log(JSON.stringify(json, null, 2));
    if (!json.found) {
        console.warn("we could not find your zipcode: " + json.err);
    } else {
        zipcode = json.zipcode;
    }
    loadTweets();
}
function error(err, textStatus, errorThrown) {
    console.warn(err);
    console.warn(textStatus);
    console.warn(errorThrown);
}