var load = function (doc) {
    'use strict';

    if (!window.XMLHttpRequest && 'ActiveXObject' in window) {
        window.XMLHttpRequest = function () {
            return new ActiveXObject('MSXML2.XMLHttp');
        };
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "navbar.html", true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            document.getElementByID('navbar').innerHTML = "<b> Error reading navbar.html </b>";
            return;
        }

        document.getElementById('navbar').innerHTML = this.responseText;
    };

    xmlhttp.send();

    return xmlhttp.responseText;

    var xml = new XMLHttpRequest();

    xml.open("GET", "/templates/footer.html", true);

    xml.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            document.getElementByID('footer').innerHTML = "<b> Error reading footer.html </b>";
            return;
        }

        document.getElementById('footer').innerHTML = this.responseText;
    };

    xml.send();
};