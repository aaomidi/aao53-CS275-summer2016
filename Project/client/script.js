var zipcode = 12345;

function getZipcode() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
        });
    } else {
        alert("Since you didn't allow us to get your zipcode. We will be using 10000 as your default zipcode.");
    }
}
function zipcode_callback(json) {
    console.log(json);
}