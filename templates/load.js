var load = function (doc) {
    'use strict';

    if (!window.XMLHttpRequest && 'ActiveXObject' in window) {
        window.XMLHttpRequest = function () {
            return new ActiveXObject('MSXML2.XMLHttp');
        };
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "https://aaomidi.github.io/aao53-CS275-summer2016/templates/navbar.html", true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            document.getElementById('navbar').innerHTML = "<b> Error reading navbar.html </b>";
            return;
        }

        document.getElementById('navbar').innerHTML = this.responseText;
    };

    xmlhttp.send();

    return xmlhttp.responseText;
};