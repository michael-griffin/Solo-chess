import React from "react"
import {useState} from "react"
import LeftNav from "./LeftNav"
import {chessGame, chessPiece, rook} from "./gamepieces.js" 

//import rookImage from "./wr.png" This works, but is a bit convoluted to do for every icon.
//Images are currently living in public/icons/ (the folder is identical to here, but doesn't require
//an import step.)
function App() {
  /*
  //Still to do:
    //Need to get more into State. Probably need to have gameState as its own thing or as a Ref.
    //From that, need to pass in game to boardJSX so it can access 'selected' property of game class.
      //selected class needs to be added to one square, legal-move needs to be added to multiple squares if a piece is selected.

  //Improvements:
    //could have CSS classes for displaying pieces. Then don't have to redraw img src on each.
    //Could update gamepieces.js to standardize possible moves.
    //currently images are living in two spots. LeftNav uses public/icons, piece imgs are from src/icons/pieces.
      //clean up folders so they are non-redundant. Make their names less confusing?

  //Board
  Currently need to work out how to set up board interactivity
    Should be able to click on individual pieces AND individual spots on board.
    Individual spots implies a large board state
      JSX to make a series of square components within a board grid.
        squares should have: row + col, whether or not they have a piece (possMove highlights?)

  //What happens when you click on a piece?
    //Square is highlighted
    //possible moves are highlighted w/ circle. If piece capture highlight border.
      //If clicking a possible move
        //and it's a capture
          //Update board. remove my piece from previous position + insert at new
            //remove enemy piece from new
        //and it's not a capture
          //Update board: remove my piece from previous position + insert at new
      //If clicking one of your pieces
        //switch selected to new piece + highlight new moves
      //If clicking an empty square or an enemy piece
        //unselect
      //If clicking same piece again
        //unselect
  
  //From above, it looks like we need more things on chessGame class.
    //selected piece would be helpful (which will have possible moves which we can highlight)
    
  For highlighting previous:
    //Previous-start: previous piece position, pre-move.
    //previous-end: previous piece position, post-move.

  For adding circles to the screen to show possible moves.
  //looks like the css is:
  //Empty Square (small green circle)
    background-image: radial-gradient(rgba(20, 85, 30, 0.5) 19%, rgba(0, 0, 0, 0) 20%);
  //Capture (this highlights edges with green)
    background-image: radial-gradient(transparent 0%, transparent 79%, rgba(20, 85, 0, 0.3) 80%)
  //LeftNav

  //Right Sidebar

  */

  //May need something like useRef to manage currentGame (we want it to persist between renders).
  let currentGame = new chessGame;
  let startingPieces = [
    {type: 'rook', color: 'white', row: 0, col: 0}, 
    {type: 'rook', color: 'white', row: 7, col: 7}, 
    {type: 'rook', color: 'black', row: 7, col: 4}, 
    {type: 'rook', color: 'black', row: 5, col: 0} 
  ];
  currentGame.addPieces(startingPieces);

  let [boardState, setBoardState] = useState(currentGame.board);
  console.log(boardState);

  let handleSquareClick = (evt) => {
    console.log(evt.target.classList[0]); //first class is coords.
    let coordString = evt.target.classList[0]; //meta tag, has board position.
    let [clickedRow, clickedCol] = [+coordString[0], +coordString[1]];
    console.log('selected row is: ', clickedRow);
    console.log('selected col is: ', clickedCol);
    
    let currPiece = boardState[clickedRow, clickedCol]; //current game?
    let currLegalMoves = currPiece.currLegalMoves.slice();

    for (let i = 0; i < currLegalMoves; i++){
      //I want to just add classList here. But do I need to push this into boardJSX code?

    }
    //If no piece selected:
      //select piece if possible
      //display valid moves.
    
    
    //check if piece is selected:
      //if so, check if valid move.

  //Has to do a lot:
  //What happens when you click on a piece?
    //Square is highlighted
    //possible moves are highlighted w/ circle. If piece capture highlight border.
      //If clicking a possible move
        //and it's a capture
          //Update board. remove my piece from previous position + insert at new
            //remove enemy piece from new
        //and it's not a capture
          //Update board: remove my piece from previous position + insert at new
      //If clicking one of your pieces
        //switch selected to new piece + highlight new moves
      //If clicking an empty square or an enemy piece
        //unselect
      //If clicking same piece again
        //unselect
  }

  //write JSX as as a function of boardState. 
  let writeBoardJSX = (board) => {

    let fullboardJSX = [];
    let rowJSX;
    let squaresJSX = [];
    
    for (let i = 0; i < board.length; i++){ //rows
      let currRow = board[i];
      //squaresJSX = [];
      for (let j = 0; j < currRow.length; j++){ //columns
        let currSquare = board[i][j];
        let squareColor = (i+j) % 2 ? "black-square" : "white-square"; //if i+j is even, color is white. else black.
        let squarePiece = currSquare ? currSquare.color + '-' + currSquare.constructor.name : ''; 
        let squareMeta = '' + i + j; //not used for display, shows coords when inspecting. Used in handleClick.
        //Display dependent on classes: 
        let squareClasses = squareMeta + " board-square " + squareColor;
        if (squarePiece){
          squareClasses += ' ' + squarePiece;
        }
        
        
        let squareJSX = <div key={'square-'+i+j} className={squareClasses}
          onClick={handleSquareClick}></div>;
        squaresJSX.push(squareJSX);
      }
      //rowJSX = <div key={'row-' + i} className="board-row">{squaresJSX}</div>;
      //fullboardJSX.push(rowJSX);
    }
    fullboardJSX.push(squaresJSX);

    return fullboardJSX;
    /*
    let testJSX = [];
    let testrowJSX = [<div>Val1</div>, <div>Val2</div>, <div>Val3</div>];
    testJSX.push(testrowJSX, testrowJSX, testrowJSX);
    return testJSX;
    */
  };

  let boardJSX = writeBoardJSX(boardState);

  return (
    <div className="App">
      <LeftNav />
      <main className="mainbody">
        <div className="mainhead">(Icon) Opponent + Time</div>
        <div className="fullboard">
          {boardJSX}
        </div>
        <div className="mainfoot">(Icon) You + Time</div>
      </main>
      <aside className="sidebar">
        <div className="righthead">
          <div className="rightheadmsg">Play Chess</div>
          <div className="rightheadicon">hand takes pawn</div>
        </div>
        
        <div className="rightbody">Just Imagine, like, a lot of stuff here.
          <div className="playonline">Play Online</div>
          <div className="playcomputer">Computer</div>
          <div className="playafriend">Play a Friend</div>
          <div className="playvariants">Play Variants</div>
        </div>
      </aside>
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
