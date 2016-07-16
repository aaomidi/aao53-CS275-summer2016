var apiKey = "";
function callAPI() {
    jQuery.timeago.settings.allowFuture = true;

    var element = document.getElementById("input");
    apiKey = element.value;
    apiKey = encodeURIComponent(apiKey);
    var url = "https://api.wunderground.com/api/" + apiKey + "/geolookup/q/autoip.json";

    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        data: "[]",
        dataType: "jsonp",
        success: getZip,
        error: error
    });
}

function getZip(resp) {
    var zipCode = resp.location.zip;
    if (zipCode == null) {
        error("Zipcode was not found.");
        return;
    }
    zipCode = encodeURIComponent(zipCode);
    document.getElementById("zip").innerHTML = "Zipcode found: " + zipCode;
    var url = "https://api.wunderground.com/api/" + apiKey + "/hourly/q/" + zipCode + ".json";

    //$.getJSON(url, {}, getWeather);

    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        data: "[]",
        dataType: "jsonp",
        success: getWeather,
        error: error
    });
}
function getWeather(resp) {
    var t = makeTable();
    var i = 0;
    for (var key in resp.hourly_forecast) {
        i++;
        var time = resp.hourly_forecast[key].FCTTIME.pretty;
        var epoch = resp.hourly_forecast[key].FCTTIME.epoch;
        var tempCelsius = resp.hourly_forecast[key].temp.metric;
        var condition = resp.hourly_forecast[key].conditon;
        var iconURL = resp.hourly_forecast[key].icon_url;
        iconURL = iconURL.replace(/^http:\/\//i, 'https://');

        var info = {
            time: time,
            epoch: epoch,
            tempCelsius: tempCelsius,
            condition: condition,
            iconURL: iconURL
        };

        addData(t, info, i);
    }
}
function makeTable() {
    var tableD = document.getElementById("results");

    while (tableD.firstChild) {
        tableD.removeChild(tableD.firstChild);
    }

    var tbl = tableD.appendChild(document.createElement("table"));
    tbl.classList.add("table", "table-nonfluid");
    addRow(tbl, 3);
    tbl.rows[0].cells[0].innerHTML = "Time";
    tbl.rows[0].cells[1].innerHTML = "Temperature";
    tbl.rows[0].cells[2].innerHTML = "Icon";

    return tbl;
}
function addData(tbl, info, i) {
    addRow(tbl, 3);
    var d = new Date(info.epoch * 1000);

    var img = document.createElement("img");
    img.setAttribute('src', info.iconURL);

    var time = document.createElement("time");
    time.classList.add("mytime");
    time.setAttribute('data-epoch', "" + info.epoch * 1000);

    time.innerHTML = jQuery.timeago(d);
    time.setAttribute('onclick', "timeUpdate(this)");

    tbl.rows[i].cells[0].innerHTML = time.outerHTML;
    tbl.rows[i].cells[1].innerHTML = info.tempCelsius;
    tbl.rows[i].cells[2].innerHTML = img.outerHTML;
}

function timeUpdate(elm) {
    var jelm = $(elm);
    if (jelm.data('type') == null) {
        jelm.data('type', "fuz");
    }
    if (jelm.data('type') === "fuz") {
        jelm.data('type', "exact");
        elm.innerHTML = new Date(Number(elm.getAttribute('data-epoch'))).toLocaleString();
    } else {
        jelm.data('type', "fuz");
        elm.innerHTML = jQuery.timeago(new Date(Number(elm.getAttribute('data-epoch'))));
    }
}
/**
 * Adds a row to the table with count cells.
 * @param tbl The table obj
 * @param count Number of cells.
 */
function addRow(tbl, count) {
    var newRow = tbl.insertRow();
    for (var i = 0; i < count; i++) {
        newRow.insertCell();
    }
}
function error(xhr, ajaxOptions, thrownError) {
    console.log(thrownError);
    var tableD = document.getElementById("results");

    while (tableD.firstChild) {
        tableD.removeChild(tableD.firstChild);
    }

    tableD.innerHTML = thrownError;
}