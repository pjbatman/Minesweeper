let board = [];
let rows;
let columns;

let minesCount;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //goal to click all tiles except the ones containing mines
let flagEnabled = false; //tracks if flag mode is on

let gameOver = false; //true if mine is clicked or tilesClicked == totalTiles - minesCount

window.onload = function() {
    setGamemode();
}

/** 
 * Randomly sets locations for mines
 */
function setMines() {
    minesLocation = [];
    tilesClicked = 0;

    let minesLeft = minesCount;

    //randomly generates locations of mines for the round
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        //checks if random location was already generated
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function setGamemode(value) {
   
    if (value == 'e') {
        rows = 8;
        columns = 10;
        minesCount = 10;
        document.getElementById("board").style.width = '500px';
        document.getElementById("board").style.height = '400px';
        startGame();
    } else if (value == 'm') {
        rows = 14;
        columns = 18;
        minesCount = 40;
        document.getElementById("board").style.width = '900px';
        document.getElementById("board").style.height = '700px';
        startGame();
    } else if (value == 'h') {
        rows = 24;
        columns = 20;
        minesCount = 99;
        document.getElementById("board").style.width = '1200px';
        document.getElementById("board").style.height= '1000px';
        startGame();
    }
}


function startGame() {
    document.getElementById('board').style.visibility = 'visible'
    document.getElementById('flag-button').style.visibility = 'visible'
    document.getElementById('mines-title').style.visibility = 'visible'

    document.getElementById('difficulty').remove();

    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);

    setMines();
    populate_board();
}

function populate_board() {

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        gameOverScreen();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      //top left
    minesFound += checkTile(r-1, c);        //top 
    minesFound += checkTile(r-1, c+1);      //top right

    //left and right
    minesFound += checkTile(r, c-1);        //left
    minesFound += checkTile(r, c+1);        //right

    //bottom 3
    minesFound += checkTile(r+1, c-1);      //bottom left
    minesFound += checkTile(r+1, c);        //bottom 
    minesFound += checkTile(r+1, c+1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";
        
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("gameover-text").innerText = "You Win!";
        gameOver = true;
        gameOverScreen();
    }
}

function gameOverScreen() {
    document.getElementById('mines-title').remove();
    document.getElementById('gameover-text').style.visibility = 'visible'
    document.getElementById('play-again').style.visibility = 'visible'

    document.getElementById('gameover-text').style.fontSize = '100px'

}
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
