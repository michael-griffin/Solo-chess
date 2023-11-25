import React, { useState } from "react";


/**
 * Desc
 * props
 * state
 * comp -> comp
 */
function SoloGameBoard({ game, setGame, completeLevel}) {


  let handleSquareClick = (evt) => {
    let coordString = evt.target.classList[0]; //meta tag, has board position.
    let [clickedRow, clickedCol] = [+coordString[0], +coordString[1]];

    let selectPiece = (currPiece) => {
      setGame((prevGame => {
        let gameNow = Object.assign(
          Object.create(Object.getPrototypeOf(prevGame)), prevGame);
        gameNow.selected = currPiece;
        return gameNow;
      }));
    };

    let unselectPiece = () => {
      setGame((prevGame => {
        let gameNow = Object.assign(
          Object.create(Object.getPrototypeOf(prevGame)), prevGame);
        gameNow.selected = null;
        gameNow.selectedMoves = [];
        return gameNow;
      }));
    };

    //TODO: After piece move, check if finished?
    let movePiece = (destRow, destCol) => {
      setGame(prevGame => {
        let gameNow = Object.assign(
          Object.create(Object.getPrototypeOf(prevGame)), prevGame);
        gameNow.movePiece(destRow, destCol);
        gameNow.selected = null;
        gameNow.selectedMoves = [];

        if (gameNow.pieces.length === 1){
          completeLevel();
        }
        //console.log('moved piece. current game is:', gameNow);
        return gameNow;
      });
    };


    let currPiece = game.board[clickedRow][clickedCol];

    if (game.selected) {
      const validMove = game.selected.isValidMove(clickedRow, clickedCol);
      if (validMove) {
        movePiece(clickedRow, clickedCol);
      } else {
        unselectPiece();
      }
    } else {
      if (currPiece) {
        selectPiece(currPiece);
      }
    }
  };

  /**write JSX as as a function of game's board. */
  function writeBoardJSX() {
    const board = game.board;
    const fullboardJSX = [];
    const squaresJSX = [];

    for (let i = 0; i < board.length; i++) { //rows
      const currRow = board[i];
      for (let j = 0; j < currRow.length; j++) { //columns
        const currSquare = board[i][j];

        //Update Display dependent on classes:
        const squareCoords = '' + i + j; //used in handleClick.
        const squareColor = (i + j) % 2 ? " black-square" : " white-square"; //if i+j is even, color is white
        const squarePiece = currSquare ? ' ' + currSquare.color + '-' + currSquare.constructor.name : '';

        const isSelected = (game.selected?.row === i && game.selected?.col === j) ? ' selected' : '';
        const moveDest = (game.selected?.isValidMove(i, j)) ? ' move-dest' : '';
        const canCapture = (moveDest && squarePiece) ? `${squarePiece}-capt` : '';

        let squareClasses = squareCoords + " square " + squareColor + squarePiece +
          isSelected + moveDest + canCapture;
        squareClasses = squareClasses.toLowerCase();

        //build JSX, push to the array that becomes the displayed board once gridified.
        const squareJSX = <div
          key={'square-' + i + j}
          className={squareClasses}
          onClick={handleSquareClick}>
        </div>;
        squaresJSX.push(squareJSX);
      }
    }
    fullboardJSX.push(squaresJSX);

    return fullboardJSX;
  };

  const boardJSX = writeBoardJSX();

  return (
    <div className="board-container">
      <div className="fullboard">
        {boardJSX}
      </div>
    </div>
  );
}

export default SoloGameBoard;