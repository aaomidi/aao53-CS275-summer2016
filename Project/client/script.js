var zipcode = 12345;

function getZipcode() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            var long = position.coords.longitude;
            var lat = position.coords.latitude;
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&sensor=true';

            $.ajax({
                url: url,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                data: "[]",
                dataType: "jsonp",
                success: zipcode_callback,
                error: error
            });
        });
    } else {
        alert("Since you didn't allow us to get your zipcode. We will be using 10000 as your default zipcode.");
    }
}
function zipcode_callback(json) {
    console.log(JSON.stringify(json, null, 2));
}