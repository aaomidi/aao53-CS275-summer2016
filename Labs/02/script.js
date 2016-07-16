var apiKey = "";
function callAPI() {
    var element = document.getElementById("input");
    apiKey = element.value;
    apiKey = encodeURIComponent(apiKey);
    var url = "http://api.wunderground.com/api/" + apiKey + "/geolookup/q/autoip.json";
    $.getJSON(url, {}, getZip);
}

function getZip(resp) {
    var zipCode = resp.location.zipcode;
    if (zipCode == null) {
        error("Zipcode was not found.");
        return;
    }
    zipCode = encodeURIComponent(zipCode);
    var url = "http://api.wunderground.com/api/" + apiKey + "/hourly/q/" + zipCode + ".json";

    $.getJSON(url, {}, getLocation());
}
function getLocation(resp) {
    alert(resp);
}
function error(error) {

}