var url = "https://lab3.aaomidi.com/show/";
function callAPI(x) {
    var u = urlMaker(x);
    $.ajax({
        url: u,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        data: "[]",
        dataType: "jsonp",
        success: function f(resp) {
            succ(x, resp);
        },
        error: error
    });
}
function urlMaker(x) {
    switch (x) {
        case 1:
            return url + "all";
        case 2:
            return url + "students";
        case 3:
        {
            var term = $("#term-selection").val();
            return url + "courses/" + term;
        }
        case 4:
        {
            var option = $("#report-selection").val();
            return url + "report/" + option;
        }
        case 5:
            return url + "students/size";
        case 6:
            return url + "courses/all";
        case 7:
            return url + "majors";
        case 8:
        {
            var grade = $("#grade-selection").val();
            var courseName = $("#courseName").val();
            var u = url + "search/" + grade;
            if (courseName != null) {
                u = u + "/" + courseName;
            }
            return u;
        }
    }
}

function succ(x, resp) {
    $("#jsonArea").html(syntaxHighlight(resp));
    // document.getElementById('jsonArea').innerHTML=syntaxHighlight(resp);
    switch (x) {
        case 1:
        {

        }
    }
}
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
function error(err, textStatus, errorThrown) {
    console.warn(err);
    console.warn(textStatus);
    console.warn(errorThrown);
}