lastUsed = null;
var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

function clickedBox(element) {
    if (lastUsed == null) {
        lastUsed = "O";
    }
    cell = $(element).attr("id");
    var row = parseInt(cell[1]);
    var col = parseInt(cell[2]);

    if (board[row][col] != null) { // Make sure its empty
        return;
    }

    var toUse;
    if (lastUsed == "X") {
        lastUsed = "O";
        toUse = "O";
    } else {
        lastUsed = "X";
        toUse = "X";
    }
    element.innerHTML = toUse;
    board[row][col] = toUse;
    var win = checkWin();
    if (win == true) {
        alert(toUse + " won the game!");
    }

}
function checkWin() {
    // Check col
    for (i = 0; i < 3; i++) { // Rows
        checked = null;
        win = false;
        for (j = 0; j < 3; j++) { // Columns
            v = board[i][j];
            if (v == null) break;
            if (checked == null) {
                checked = board[i][j]
            } else if (checked != board[i][j]) {
                break;
            } else if (checked == board[i][j] && j == 2) {
                win = true;
                break;
            }
        }
        if (win == true) {
            return win;
        }
    }

    // Check row
    for (i = 0; i < 3; i++) { // Columns
        checked = null;
        win = false;
        for (j = 0; j < 3; j++) { // Rows
            v = board[j][i];
            if (v == null) break;
            if (checked == null) {
                checked = board[j][i]
            } else if (checked != board[j][i]) {
                break;
            } else if (checked == board[j][i] && j == 2) {
                win = true;
                break;
            }
        }
        if (win == true) {
            return win;
        }
    }

    // Check diag
    checked = null;
    win = false;
    for (i = 0; i < 3; i++) { // Columns
        v = board[i][i];
        if (v == null) break;
        if (checked == null) {
            checked = board[i][i]
        } else if (checked != board[i][i]) {
            break;
        } else if (checked == board[i][i] && i == 2) {
            win = true;
            break;
        }
    }
    if (win == true) {
        return win;
    }

    // Check anti-diag
    checked = null;
    win = false;
    for (i = 0, j = 2; i < 3; i++, j--) { // Columns
        v = board[i][j];
        if (v == null) break;
        if (checked == null) {
            checked = board[i][j]
        } else if (checked != board[i][j]) {
            break;
        } else if (checked == board[i][j] && i == 2) {
            win = true;
            break;
        }
    }
    if (win == true) {
        return win;
    }
}

function resetGame() {
    $("#game").children().each(function () {
        this.innerHTML = "";
    });
    lastUsed = null;
}

