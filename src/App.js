import React from "react"
import {useState} from "react"
import LeftNav from "./LeftNav"
import BoardSidebar from "./BoardSidebar"
import {chessGame, chessPiece, rook} from "./gamepieces.js"
import parseShorthand from "./utils/parseShorthand.js"

//Odd error: breaks when bishop is added to final row.
const DEMO_START_BISHOP = "B5r1/8/8/8/8/8/8/8";
const DEMO_MIDDLE_KNIGHT = "8/8/8/3N4/5r2/8/8/8";
const DEMO_MIDDLE_QUEEN = "6r1/8/8/3Q4/5r2/8/8/8";
const STANDARD_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

//TODO: current issue: bishop's internal position keeps getting reset to 0,0
//First move correctly updates position. Clicking piece to begin 2nd move
//Is where reset occurs.
//TODO: build node testing area first. Hard to know if it's a class or react issue
//Concerned it's got something to do with updates to board state not keeping
//in sync with the methods.
/*
//Still to do:

//Improvements:
  //Could update gamepieces.js to standardize possible moves.
  //currently images are living in two spots. LeftNav uses public/icons, piece imgs are from src/piece-icons.

//Board
//Pieces are moving, selection's working ok. Need to test other pieces.



//Right Sidebar

*/

/**
 * App desc
 * state
 * component -> component
 */
function App() {

  let [gameMode, setGameMode] = useState('solo-chess'); //or puzzle, or...

  let currentGame = new chessGame;
  const startingPieces = parseShorthand(DEMO_MIDDLE_QUEEN);
  console.log(startingPieces);
  currentGame.addPieces(startingPieces);

  let [gameState, setGameState] = useState(currentGame);

  let handleSquareClick = (evt) => {
    let coordString = evt.target.classList[0]; //meta tag, has board position.
    let [clickedRow, clickedCol] = [+coordString[0], +coordString[1]];
    //console.log('selected row is: ', clickedRow, 'selected col is: ', clickedCol);

    let selectPiece = (currPiece) => {
      setGameState((prevGameState => {
        //SHOULD IN THEORY MAKE A COPY. Otherwise this gets messy fast.
        let gameStateNow = Object.assign(Object.create(Object.getPrototypeOf(prevGameState)),prevGameState);
        gameStateNow.selected = currPiece;
        //console.log('Made selection. current gameState is:', gameStateNow);
        return gameStateNow;
      }))
    };

    let unselectPiece = () => {
      setGameState((prevGameState => {
        let gameStateNow = Object.assign(Object.create(Object.getPrototypeOf(prevGameState)),prevGameState);
        gameStateNow.selected = null;
        gameStateNow.selectedMoves = [];

        //console.log('Cleared selection. current gameState is:', gameStateNow);
        return gameStateNow;
      }));
    };

    let movePiece = (destRow, destCol) => {
      setGameState(prevGameState => {
        let gameStateNow = Object.assign(Object.create(Object.getPrototypeOf(prevGameState)),prevGameState);
        gameStateNow.movePiece(destRow, destCol);
        gameStateNow.selected = null;
        gameStateNow.selectedMoves = [];

        //console.log('Cleared selection. current gameState is:', gameStateNow);
        return gameStateNow;
      });
    };


    let currPiece = gameState.board[clickedRow][clickedCol];

    if (gameState.selected){
      let validMove = gameState.selected.isValidMove(clickedRow, clickedCol);
      if (validMove){
        movePiece(clickedRow, clickedCol);
      } else {
        unselectPiece();
      }
    } else {
      if (currPiece){ //Select if same color
        selectPiece(currPiece);
      }
    }
  }

  //write JSX as as a function of gameState.
  let writeBoardJSX = (game) => {
    let board = game.board;
    let fullboardJSX = [];
    //let rowJSX;
    let squaresJSX = [];

    for (let i = 0; i < board.length; i++){ //rows
      let currRow = board[i];
      for (let j = 0; j < currRow.length; j++){ //columns
        let currSquare = board[i][j];

        //Display dependent on classes:
        //Each of the below variables CAN add a class to squareJSX.
        let squareCoords = '' + i + j; //used in handleClick.
        let squareColor = (i+j) % 2 ? " black-square" : " white-square"; //if i+j is even, color is white
        let squarePiece = currSquare ? ' ' + currSquare.color + '-' + currSquare.constructor.name : '';

        //Sort of dangerous below: && if game.selected is null, && short-circuits
        //this is NEEDED, since game.selected.row would throw an error.
        //Could try optional chaining: game.selected?.row (this should return undefined rather than throw error)
        let isSelected = (game.selected && game.selected.row == [i] && game.selected.col == [j]) ? ' selected' : '';
        let moveDest = (game.selected && game.selected.isValidMove(i,j)) ? ' move-dest' : '';
        let canCapture = (moveDest && squarePiece) ? `${squarePiece}-capt` : '';
        // console.log('currSqPiece: ', squarePiece);
        // console.log('currSquare: ', currSquare);

        let squareClasses = squareCoords + " square " + squareColor + squarePiece +
        isSelected + moveDest + canCapture;

        //build JSX, push to the array that becomes the displayed board once gridified.
        let squareJSX = <div key={'square-'+i+j} className={squareClasses}
          onClick={handleSquareClick}></div>;
        squaresJSX.push(squareJSX);
      }
    }
    fullboardJSX.push(squaresJSX);

    return fullboardJSX;
  };

  let boardJSX = writeBoardJSX(gameState);

  return (
    <div className="App">
      <LeftNav />
      <main>
        <div className="board-container">
          <div className="fullboard">
            {boardJSX}
          </div>
        </div>
      <BoardSidebar />
      </main>
    </div>
  );
}

export default App;

//hex colors for site:
//https://imagecolorpicker.com/en
//#312e2b   rgba(49,46,43,255)      base background color (in between menus/board)
//#272522   rgba(39,37,34,255)      //darker grey: left/right nav menus
//#22211f   rgba(34,33,31,255)      //almost black for the extra-menu
//#769656   rgba(118,150,86,255)    //green for board.
//#eeeed2   rgba(238,238,210,255)   //off-white for board.
//          rgba(255,255,0,255)     //yellow for selected piece.
//#dedede   rgba(222,222,222,255)   //almost full white for leftmenu text
//ffffff    rgba(255,255,255,255)   //full white for rightmenu text

//Currently will try to mimic layout exactly, but realistically should cut watch/some of the other nav menu options
//and prioritize the play variants option.


//Notes on style from chess.com:
//Looks like grid for board, flex-container for right-side set up (start game, settings and such). Flex wraps to new role when it gets small enough.
//gridboard maxes at ~70px per square, can shrink quite low. Gridboard also has right aligned section with focus/theater/settings buttons.

//left-side nav bar fancy/tricky. Icon based, but for now can simply have a holder with the relevant links.
//Chess.com actually skips the header the top.

//Notes on dragging pieces:
//Lichess does this and has a special 'black knight dragging' class for when mouse is down and moving piece.
  //Also has a style: transform that updates its coordinates (in pixels?) as you drag.

/*
//old helper function in board JSX function.
//useful when we were adding images as content. Now no longer needed.

    let getPiece = (pieceName, pieceColor) => {
      let squarePiece;
      if (pieceName == "rook") {
        let srcpath = pieceColor == 'white' ? 'icons/pieces/wr.png' : './icons/pieces/br.png';
        squarePiece = <img className="board-square-icon" src={srcpath} />;
      }
      return squarePiece;
    }

/*
<svg viewBox="0 0 100 100" class="coordinates">
  <text x="0.75" y="3.5" font-size="2.8" class="coordinate-light">8</text>
  <text x="0.75" y="15.75" font-size="2.8" class="coordinate-dark">7</text>
  <text x="0.75" y="28.25" font-size="2.8" class="coordinate-light">6</text>
  <text x="0.75" y="40.75" font-size="2.8" class="coordinate-dark">5</text>
  <text x="0.75" y="53.25" font-size="2.8" class="coordinate-light">4</text>
  <text x="0.75" y="65.75" font-size="2.8" class="coordinate-dark">3</text>
  <text x="0.75" y="78.25" font-size="2.8" class="coordinate-light">2</text>
  <text x="0.75" y="90.75" font-size="2.8" class="coordinate-dark">1</text>
  <text x="10" y="99" font-size="2.8" class="coordinate-dark">a</text>
  <text x="22.5" y="99" font-size="2.8" class="coordinate-light">b</text>
  <text x="35" y="99" font-size="2.8" class="coordinate-dark">c</text>
  <text x="47.5" y="99" font-size="2.8" class="coordinate-light">d</text>
  <text x="60" y="99" font-size="2.8" class="coordinate-dark">e</text>
  <text x="72.5" y="99" font-size="2.8" class="coordinate-light">f</text>
  <text x="85" y="99" font-size="2.8" class="coordinate-dark">g</text>
  <text x="97.5" y="99" font-size="2.8" class="coordinate-light">h</text>
</svg>
*/
// let startingPieces = [
//   {type: 'rook', color: 'white', row: 0, col: 0},
//   {type: 'rook', color: 'white', row: 7, col: 7},
//   {type: 'rook', color: 'black', row: 7, col: 4},
//   {type: 'rook', color: 'black', row: 5, col: 0}
// ];