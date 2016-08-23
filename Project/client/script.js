var zipcodeRegex = /^\d{5}$/;
var nameRegex = /^[\w .]{1,16}$/;
var messageRegex = /^.{1,140}$/;

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
        }, function (err) {
            zipcode = 12345;
            var r = {
                found: false,
                zipcode: 12345
            };
            zipcode_callback(r);
        });
    } else {
        console.warn("Since you didn't allow us to get your zipcode. We will be using 12345 as your default zipcode.");
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
function submitTweet() {
    var name = $("#name").val();
    var tweet = $("#tweet").val();

    var r = nameRegex.test(name);
    if (!r) {
        $("#err").html("Name has an error!");
        return;
    }

    r = messageRegex.test(tweet);
    if (!r) {
        $("#err").html("Message has an error!");
        return;
    }

    var data = {
        type: "put",
        zipcode: zipcode,
        name: name,
        message: tweet
    };
    var url = 'https://project.aaomidi.com/api/put';

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (resp) {
            loadTweets();
        },
        error: error
    });
}
function tweet_callback(json) {
    $("#tweetRow").empty();
    for (var i in json.messages) {
        if (!json.messages.hasOwnProperty(i)) {
            continue;
        }

        console.log(json.messages[i]);
        $("#tweetRow").append("<div class='col-md-8 twt'><span class='strong'>"
            + "Author: </span>" + json.messages[i].author +
            "<br>"
            + json.messages[i].tweet + "</div>");
    }
}
function zipcode_callback(json) {
    console.log(JSON.stringify(json, null, 2));
    if (!json.found) {
        console.warn("we could not find your zipcode: " + json.err);
    } else {
        zipcode = json.zipcode;
    }
    $("#zip").html("Zipcode:" + zipcode);
    loadTweets();
}
function error(err, textStatus, errorThrown) {
    console.warn(err);
    console.warn(textStatus);
    console.warn(errorThrown);
}
