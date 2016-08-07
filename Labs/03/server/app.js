var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var mysql = require('mysql');

var app = express();
var server = http.createServer(app);
var con;
app.use(bodyParser());


var connectToSQL = function () {
    var obj = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    con = mysql.createConnection(obj.mysql);
    con.connect(function (err) {
        if (err) {
            console.log("Error connecting to database.");
            console.log(err);
        } else {
            console.log("Connected to the database.");
        }
    })
};


app.get('/show/:type/:optional?/:optional2?', function (req, res) {
    switch (req.params.type) {
        case "all":
        {
            var query = "SELECT l3_students.studentID, l3_students.name_first, l3_students.name_last, l3_students.age, l3_students.major, l3_grades.courseName, l3_grades.termTaken, l3_grades.grade FROM l3_students INNER JOIN l3_grades ON l3_students.studentID=l3_grades.studentID ORDER BY l3_students.studentID;";
            con.query(query, function (err, rows, fields) {
                if (err) throw err;
                var result = {
                    students: []
                };
                for (var i in rows) {
                    if (result.students.length == 0 || result.students[result.students.length - 1].studentID != rows[i].studentID) {
                        var student = {
                            studentID: null,
                            first_name: null,
                            last_name: null,
                            major: null,
                            age: null,
                            grades: []
                        };
                        student.studentID = rows[i].studentID;
                        student.first_name = rows[i].name_first;
                        student.last_name = rows[i].name_last;
                        student.age = rows[i].age;
                        student.major = rows[i].major;

                        result.students.push(student);
                    }

                    var grade = {
                        course: rows[i].courseName,
                        termTaken: rows[i].termTaken,
                        grade: rows[i].grade
                    };

                    result.students[result.students.length - 1].grades.push(grade);
                }
                showResults(result, req, res);

            });
            break;
        }
        case "students":
        {
            var query = "SELECT studentID, name_first, name_last from l3_students ORDER BY l3_students.studentID";
            var result = {
                students: []
            };
            con.query(query, function (err, rows, fields) {
                for (var i in rows) {
                    var student = {
                        first_name: null,
                        last_name: null
                    };
                    student.studentID = rows[i].studentID;
                    student.first_name = rows[i].name_first;
                    student.last_name = rows[i].name_last;

                    result.students.push(student);

                }
                if (req.params.optional === "size") {
                    var re = {
                        size: result.students.length
                    };
                    showResults(re, req, res);
                } else {
                    showResults(result, req, res);
                }

            });
            break;
        }
        case "courses":
        {
            var result = {
                courses: []
            };

            var term = req.params.optional;
            if (term == null) {
                term = "fall";
            }

            var query;
            if (term.toLowerCase() === 'all') {
                query = "SELECT DISTINCT courseName FROM l3_grades";
            } else {
                query = "SELECT DISTINCT courseName FROM l3_grades WHERE termTaken=" + con.escape(term);
            }

            con.query(query, function (err, rows, fields) {
                for (var i in rows) {
                    result.courses.push(rows[i].courseName);
                }
                showResults(result, req, res);
            });
            break;
        }
        case "report":
        {
            switch (req.params.optional) {
                case "studentID":
                {
                    var query = "SELECT l3_students.studentID, l3_grades.courseName, l3_grades.termTaken, l3_grades.grade FROM l3_students INNER JOIN l3_grades ON l3_students.studentID=l3_grades.studentID ORDER BY l3_grades.termTaken;";
                    con.query(query, function (err, rows, fields) {
                        if (err) throw err;
                        var result = {
                            students: []
                        };
                        for (var i in rows) {
                            if (result.students.length == 0 || result.students[result.students.length - 1].studentID != rows[i].studentID) {
                                var student = {
                                    studentID: null,
                                    grades: []
                                };
                                student.studentID = rows[i].studentID;
                                result.students.push(student);
                            }

                            var grade = {
                                course: rows[i].courseName,
                                termTaken: rows[i].termTaken,
                                grade: rows[i].grade
                            };

                            result.students[result.students.length - 1].grades.push(grade);
                        }
                        showResults(result, req, res);

                    });
                    break;
                }
                case "name":
                {
                    var query = "SELECT l3_students.studentID, l3_students.name_first, l3_students.name_last, l3_grades.courseName, l3_grades.termTaken, l3_grades.grade FROM l3_students INNER JOIN l3_grades ON l3_students.studentID=l3_grades.studentID ORDER BY l3_students.studentID;";
                    con.query(query, function (err, rows, fields) {
                        if (err) throw err;
                        var result = {
                            students: []
                        };
                        for (var i in rows) {
                            if (result.students.length == 0 || result.students[result.students.length - 1].studentID != rows[i].studentID) {
                                var len = result.students.length;
                                if (len != 0) {
                                    delete result.students[len - 1].studentID;
                                }
                                var student = {
                                    studentID: null,
                                    first_name: null,
                                    last_name: null,
                                    grades: []
                                };
                                student.studentID = rows[i].studentID;
                                student.first_name = rows[i].name_first;
                                student.last_name = rows[i].name_last;

                                result.students.push(student);
                            }

                            var grade = {
                                course: rows[i].courseName,
                                termTaken: rows[i].termTaken,
                                grade: rows[i].grade
                            };

                            result.students[result.students.length - 1].grades.push(grade);
                        }
                        showResults(result, req, res);
                    });
                    break;
                }
            }
        }
        case "search":
        {
            var courseGrade = req.params.optional;
            var courseName = req.params.optional2;

            var query = "SELECT l3_students.studentID, l3_students.name_first, l3_students.name_last, l3_students.age, l3_students.major, l3_grades.courseName, l3_grades.termTaken, l3_grades.grade FROM l3_students INNER JOIN l3_grades ON l3_students.studentID=l3_grades.studentID ORDER BY l3_students.studentID;";
            con.query(query, function (err, rows, fields) {
                if (err) throw err;
                var result = {
                    students: []
                };
                for (var i in rows) {
                    if (result.students.length == 0 || result.students[result.students.length - 1].studentID != rows[i].studentID) {
                        var len = result.students.length;
                        if (len != 0) {
                            if (result.students[len - 1].grades.length == 0) {
                                result.students.splice(len - 1, len);
                            }
                        }
                        var student = {
                            studentID: null,
                            first_name: null,
                            last_name: null,
                            major: null,
                            age: null,
                            grades: []
                        };
                        student.studentID = rows[i].studentID;
                        student.first_name = rows[i].name_first;
                        student.last_name = rows[i].name_last;
                        student.age = rows[i].age;
                        student.major = rows[i].major;

                        result.students.push(student);
                    }

                    var grade = {
                        course: rows[i].courseName,
                        termTaken: rows[i].termTaken,
                        grade: rows[i].grade
                    };

                    if (courseName != null && courseName !== grade.course) {
                        continue;
                    }
                    if (courseGrade !== grade.grade) {
                        continue;
                    }

                    result.students[result.students.length - 1].grades.push(grade);
                }
                var len = result.students.length;
                if (len != 0) {
                    if (result.students[len - 1].grades.length == 0) {
                        result.students.splice(len - 1, len);
                    }
                }
                showResults(result, req, res);
            });
            break
        }
        case "majors":
        {
            var result = {
                majors: []
            };

            var query = "SELECT DISTINCT major FROM l3_students";

            con.query(query, function (err, rows, fields) {
                for (var i in rows) {
                    result.majors.push(rows[i].major);
                }
                console.log(JSON.stringify(result));
                showResults(result, req, res);
            });
            break;
        }
        default:
            showResults("hai :3", req, res);
    }

});

function showResults(result, request, response) {
    console.log(request.params);
    //response.writeHead(200, {'Content-Type': 'application/json'});
    response.jsonp(result);

}
server.listen(1234);

if (require.main === module) {
    connectToSQL();
}
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});