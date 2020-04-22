var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];
const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; ++i) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkTie() && !checkWin(origBoard, huPlayer)) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareID, player) {
  origBoard[squareID] = player;
  document.getElementById(squareID).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e == player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    console.log(i);
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose");
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquare() {
  return origBoard.filter(s => typeof s == "number");
}

function checkTie() {
  if (emptySquare().length == 0) {
    for (var i = 0; i < cells.length; ++i) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game");
    return true;
  } else {
    return false;
  }
}

function minimax(newboard, player) {
  var availSpots = emptySquare();
  if (checkWin(newboard, player)) {
    return { score: -10 };
  } else if (checkWin(newboard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length == 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; ++i) {
    var move = {};
    move.index = newboard[availSpots[i]];
    newboard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newboard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newboard, aiPlayer);
      move.score = result.score;
    }
    newboard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestmove;
  if (player == aiPlayer) {
    var bestscore = -10000;
    for (var i = 0; i < moves.length; ++i) {
      if (moves[i].score > bestscore) {
        bestscore = moves[i].score;
        bestmove = i;
      }
    }
  } else {
    var bestscore = +10000;
    for (var i = 0; i < moves.length; ++i) {
      if (moves[i].score < bestscore) {
        bestscore = moves[i].score;
        bestmove = i;
      }
    }
  }
  return moves[bestmove];
}
