import React, {useState} from "react";
import produce from "immer";
import CheckBox from "./CheckBox";
import Modal from "./Modal";
/**
 * Sidebar for SoloChess minigame. Includes level select/progress checkboxes.
 * Also has a panel for skipping levels, undoing moves, retrying levels,
 * resetting the game, and viewing the rules. Most buttons still need work.
 *
 * Props:
 * - levels: list of levels. includes #, diff, start position, and whether completed
 * - difficulties: derived from levels, there are 3 levels per difficulty.
 * - setCurrentLevel/setLevels/setGame: set state made in SoloChess
 *
 * SoloChess -> SoloSidebar
 */

function SoloSidebar({levels, difficulties, setCurrentLevel, setLevels, setGame}) {

  const [isOpen, setIsOpen] = useState(false);

  function writeCheckBoxesJSX (perLevel, numDiffs) {
    let checkboxGrid = [];

    let rowSquares = [];
    for (let j = 1; j <= numDiffs; j++){
      let checkboxHeader = <div key={"checkbox-header-" + j} className="checkbox-header">
        {j}
      </div>;
      rowSquares.push(checkboxHeader)
    }
    let checkBoxRow = <div key={"checkbox-header-row"} className="checkbox-row">
      {rowSquares}
    </div>;
    checkboxGrid.push(checkBoxRow);


    let count = 0;
    for (let i = 0; i < perLevel; i++){
      let rowSquares = [];
      for (let j = 1; j <= numDiffs; j++){
        let checkboxSquare;
        if (levels[i].completed) {
          checkboxSquare = <div
            key={"checkbox-square-" + count}
            className="checkbox-square">
              <CheckBox />
            </div>;
        } else {
          checkboxSquare = <div
            key={"checkbox-square-" + count}
            className="checkbox-square">
            </div>;
        }
        rowSquares.push(checkboxSquare);
        count++;
      }

      let checkBoxRow = <div key={"checkbox-row-" + i} className="checkbox-row">
        {rowSquares}</div>;
      checkboxGrid.push(checkBoxRow);
    }

    return checkboxGrid;
  };


  let checkboxesJSX;
  const numLevels = levels.length;
  const numDiffs = difficulties.length;
  const perLevel = numLevels/numDiffs;
  checkboxesJSX = writeCheckBoxesJSX(perLevel, numDiffs); //2 by 5 array, 1 extra row for headers.


  //TODO: reset game board to starting position.
  function resetBoard(){
    setGame(prevGame => {
      let updatedGame = produce(prevGame, (draft) => {
        draft.resetBoard();
      })
      return updatedGame;
    })
  }

  //TODO: Undo most recent move
  function takeBackMove(){
    // setGame(prevGame => {
    //   let newGame = prevGame;
    //   newGame.undoMove();
    //   return newGame;
    // })
    setGame(prevGame => {
      let updatedGame = produce(prevGame, (draft) => {
        draft.undoMove();
      })
      return updatedGame;
    })
  }

  function resetGame(){
    setLevels(prevLevels => {
      let newLevels = [...prevLevels];
      newLevels = newLevels.map(level => {
        let newLevel = {...level}; //above spread is a shallow copy, concerned about mutating state.
        newLevel.completed = false;
        return newLevel;
      });
      return newLevels;
    })
    setCurrentLevel(0);
  }

  function skipLevel(){
    setCurrentLevel(prev => (prev === levels.length - 1) ? 0 : prev + 1); //no update of levels state with completed.
  }

  //TODO: Open a popup Modal that displays rules for solo chess mini game.
  function toggleRules(){
    setIsOpen(prev => !prev);
  }

  return (
    <aside className="board-sidebar">
      <div className="sidebar-head">
        <h2 className="sidebar-head-text" >Solo Chess</h2>
        <img className="sidebar-head-icon" src="icons/solochess.png" alt="sidebar-icon" />
      </div>

      <div className="sidebar-body">
        <select name="level" className="sidebar-select">

          {difficulties.map(diffNum => {
            return <option key={`diff-${diffNum}`} value={`diff-${diffNum}`}>Level {diffNum}</option>
          })}
          <option key={"random"} value="random">Random</option>
        </select>

        <p className="checkbox-grid-label">Level</p>

        <div className="checkbox-grid">
          {checkboxesJSX}
        </div>
      </div>

      <footer className="sidebar-footer">
        <div className="footer-large-button-container">
          <button onClick={resetBoard} className="footer-large-button">Retry</button>
          <button onClick={takeBackMove} className="footer-large-button">Take Back</button>
        </div>
        <div className="footer-small-button-container">
          <button onClick={resetGame} className="footer-small-button">Reset</button>
          <button className="footer-small-button" onClick={toggleRules}>Rules</button>
          <Modal isOpen={isOpen} toggle={toggleRules} />
          <button onClick={skipLevel} className="footer-small-button">Skip</button>
        </div>
      </footer>
    </aside>
  )
}


export default SoloSidebar;