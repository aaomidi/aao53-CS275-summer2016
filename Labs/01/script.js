function calculate() {
    var element = document.getElementById("input");
    var tableD = document.getElementById("tableD");

    while (tableD.firstChild) {
        tableD.removeChild(tableD.firstChild);
    }

    var x = element.value;
    var value = parseInt(x);

    if (isNaN(value) || value < 1) {
        element.value = "";
        alert("Wrong input.");
        return;
    }

    var tbl = tableD.appendChild(document.createElement("table"));
    tbl.style.width = '20%';
    tbl.setAttribute('border', '1');

    setupTable(tbl, value);

    var i = 0;
    var num1 = 1;
    var num2 = 1;

    for (i = 2; i <= value; i++) {
        if (i + 1 <= value) {
            addRow(tbl);
        }
        var fib = num1 + num2;
        num1 = num2;
        num2 = fib;
        tbl.rows[i].cells[0].innerHTML = i;
        tbl.rows[i].cells[1].innerHTML = fib;
    }
}

function setupTable(tbl, input) {
    var size = 2;
    if (input > 1) {
        size = 3;
    }
    for (var i = 0; i < size; i++) {
        addRow(tbl);
    }
    tbl.rows[0].cells[0].innerHTML = 'n';
    tbl.rows[0].cells[1].innerHTML = 'f(n)';
    tbl.rows[1].cells[0].innerHTML = '1';
    tbl.rows[1].cells[1].innerHTML = '1';
    if (input > 1) {
        tbl.rows[2].cells[0].innerHTML = '2';
        tbl.rows[2].cells[1].innerHTML = '1';
    }
}


function addRow(tbl) {
    var newRow = tbl.insertRow();
    var newCell = newRow.insertCell();
    var newCell = newRow.insertCell();
}