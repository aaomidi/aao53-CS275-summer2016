var url = "https://lab3.aaomidi.com/show/";
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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
    $("#tableArea").html("");
    switch (x) {
        case 1:
        {
            makeTable();
            var tbl = $('#tbl').DataTable({
                data: resp.students,
                columns: [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    {
                        title: "First Name",
                        data: "first_name"
                    },
                    {
                        title: "Last Name",
                        data: "last_name"
                    },
                    {
                        title: "Student ID",
                        data: "studentID"
                    },
                    {
                        title: "Major",
                        data: "major"
                    },
                    {
                        title: "Age",
                        data: "age"
                    }
                ],
                iDisplayLength: 50
            });
            $('#tbl tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = tbl.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });

            break;
        }
        case 2:
        {
            makeTable();
            $('#tbl').DataTable({
                data: resp.students,
                columns: [
                    {
                        title: "First Name",
                        data: "first_name"
                    },
                    {
                        title: "Last Name",
                        data: "last_name"
                    },
                    {
                        title: "Student ID",
                        data: "studentID"
                    }
                ],
                iDisplayLength: 50
            });
            break;
        }
        case 3:
        {
            var dataSet = {
                data: []
            };
            for (var c in resp.courses) {
                dataSet.data.push([resp.courses[c]]);
            }

            makeTable();
            $('#tbl').DataTable({
                data: dataSet.data,
                columns: [
                    {title: "Courses"}
                ],
                iDisplayLength: 10
            });
            break;
        }
        case 4:
        {
            makeTable();
            if ($("#report-selection").val() === "name") {
                var tbl = $('#tbl').DataTable({
                    data: resp.students,
                    columns: [
                        {
                            "className": 'details-control',
                            "orderable": false,
                            "data": null,
                            "defaultContent": ''
                        },
                        {
                            title: "First Name",
                            data: "first_name"
                        },
                        {
                            title: "Last Name",
                            data: "last_name"
                        }
                    ],
                    iDisplayLength: 50
                });
                $('#tbl tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = tbl.row(tr);

                    if (row.child.isShown()) {
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        row.child(format(row.data())).show();
                        tr.addClass('shown');
                    }
                });
            } else {
                var tbl = $('#tbl').DataTable({
                    data: resp.students,
                    columns: [
                        {
                            "className": 'details-control',
                            "orderable": false,
                            "data": null,
                            "defaultContent": ''
                        },
                        {
                            title: "Student ID",
                            data: "studentID"
                        }
                    ],
                    iDisplayLength: 50
                });
                $('#tbl tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = tbl.row(tr);

                    if (row.child.isShown()) {
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        row.child(format(row.data())).show();
                        tr.addClass('shown');
                    }
                });
            }


            break;
        }
        case 5:
        {
            $("#tableArea").text("Number of students: " + resp.size);
            break;
        }
        case 6:
        {
            var dataSet = {
                data: []
            };
            for (var c in resp.courses) {
                dataSet.data.push([resp.courses[c]]);
            }

            makeTable();
            $('#tbl').DataTable({
                data: dataSet.data,
                columns: [
                    {title: "Courses"}
                ],
                iDisplayLength: 10
            });
            break;
        }
        case 7:
        {
            var dataSet = {
                data: []
            };
            for (var c in resp.majors) {
                dataSet.data.push([resp.majors[c]]);
            }

            makeTable();
            $('#tbl').DataTable({
                data: dataSet.data,
                columns: [
                    {title: "Majors"}
                ],
                iDisplayLength: 10
            });
            break;
        }
        case 8:
        {
            makeTable();
            var tbl = $('#tbl').DataTable({
                data: resp.students,
                columns: [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    {
                        title: "First Name",
                        data: "first_name"
                    },
                    {
                        title: "Last Name",
                        data: "last_name"
                    },
                    {
                        title: "Student ID",
                        data: "studentID"
                    },
                    {
                        title: "Major",
                        data: "major"
                    },
                    {
                        title: "Age",
                        data: "age"
                    }
                ],
                iDisplayLength: 50
            });
            $('#tbl tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = tbl.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });
            break;
        }
    }
}
/* Formatting function for row details - modify as you need */
function format(d) {
    var result = '<table class="table">';
    for (var g in d.grades) {
        result += "<tr>";
        var grade = d.grades[g];
        result += "<td>";
        result += grade.course;
        result += "</td>";
        result += "<td>";
        result += grade.termTaken.capitalizeFirstLetter();
        result += "</td>";
        result += "<td>";
        result += grade.grade;
        result += "</td>";

        result += "</tr>";
    }

    result += '</table>';
    return result;
}

function makeTable() {
    $("#tableArea").empty();
    var table = $("<table/>").attr("id", "tbl");
    table.addClass("table table-nonfluid table-bordered table-striped");
    $("#tableArea").append(table);
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