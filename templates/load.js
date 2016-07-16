var load = function (doc, site) {
    'use strict';

    if (!window.XMLHttpRequest && 'ActiveXObject' in window) {
        window.XMLHttpRequest = function () {
            return new ActiveXObject('MSXML2.XMLHttp');
        };
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "/templates/navbar.html", true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) {
            document.getElementById('navbar').innerHTML = "<b> Error reading navbar.html </b>";
            return;
        }

        document.getElementById('navbar').innerHTML = this.responseText;
        setHighlight(site)
    };

    xmlhttp.send();

    return xmlhttp.responseText;
};

function setHighlight(site) {
    var id = site.toLowerCase();
    id = "#nav-" + id;
    $(id).addClass("active");
}