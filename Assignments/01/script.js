var routes = [6, 14, 17, 20, 23, 33, 37, 42, 47, 52, 56, 60, 66, 73, 79, 108, 109];
var cols = 6;
var url = "https://septa.aaomidi.com/hackathon/TransitView/?route=";
var rowIndex = 0;
var calls = 0;
var dataSet;

/**
 * Main function
 */
function callAPI() {
    rowIndex = 0;
    $.each(routes, function (index, route) {
        $.ajax({
            url: url + route,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            data: "[]",
            dataType: "jsonp",
            success: function f(resp) {
                resp.route = route;
                fillData(resp);
                calls++;
                displayData();
            },
            error: error
        });
    });

}
/**
 * Checks to see if the dataSet is complete and puts it on the website.
 */
function displayData() {
    if (calls != routes.length) {
        return;
    }
    $('#tbl').DataTable({
        data: dataSet,
        columns: [
            {data: "route"},
            {data: "vehicleID"},
            {data: "blockID"},
            {data: "direction"},
            {data: "destination"},
            {
                data: {
                    _: "delay.off",
                    sort: "delay.exact"
                }
            }
        ],
        iDisplayLength: 50
    });
}
/**
 * Fills data with the response from septa.
 * @param resp Response from septa.
 */
function fillData(resp) {
    if (rowIndex == 0) {
        dataSet = [];
    }

    for (var b in resp.bus) {
        var off = resp.bus[b].Offset;
        if (Number(off) <= 2) {
            off = "on-time";
        }

        var delay = {
            off: off,
            exact: resp.bus[b].Offset
        };

        var info = {
            route: resp.route,
            vehicleID: resp.bus[b].VehicleID,
            blockID: resp.bus[b].BlockID,
            direction: resp.bus[b].Direction,
            destination: resp.bus[b].destination,
            delay: delay
        };

        dataSet[rowIndex] = info;
        rowIndex++;
    }
}
/**
 * Logs errors.
 * @param resp
 */
function error(resp) {
    console.warn(resp);
}


