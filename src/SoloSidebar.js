import React, {useState, useEffect} from "react";
import Papa from 'papaparse';
import CheckBox from "./CheckBox";

  //Most of this stuff will vary depending on menu type chosen.
  //Will have distinct sidebars for:
    //Solo Chess
      //for buttons, has 2: Take back move + retry level.
    //Puzzles
      //for buttons, has a hint that morphs to a 'move' button.
    //Opening Practice
    //Default/Main?

//Currently building Solo Chess
const SOLO_FILEPATH = 'data/gamelevels.csv';


//More JS way of doing things is to have an array of objects:
//{level: 1, difficulty: 1, startPosition: 'asd', completed: false}
function SoloSidebar({levels, difficulties, setGame, setCurrentLevel, setLevels}) {


  let writeCheckBoxesJSX = (perLevel, numDiffs) => {
    let checkboxGrid = [];

    let rowSquares = [];
    for (let j = 1; j <= numDiffs; j++){
      let checkboxHeader = <div key={"checkbox-header-" + j} className="checkbox-header">
        {j}</div>;
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
            key={"checkbox-square-" + (i*j + j)}
            className="checkbox-square">
              <CheckBox />
            </div>;
        } else {
          checkboxSquare = <div
            key={"checkbox-square-" + (i*j + j)}
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


  //reset game board to starting position.
  function retryLevel(){

  }

  //Undo most recent move
  function takeBackMove(){

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

  //Open a popup that displays rules for solo chess mini game.
  function displayRules(){

  }

  return (
    <aside className="board-sidebar">
      <div className="sidebar-head">
        <h2 className="sidebar-head-text" >Solo Chess</h2>
        <img className="sidebar-head-icon" src="icons/solochess.png"></img>
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
          <button className="footer-large-button">Retry</button>
          <button className="footer-large-button">Take Back</button>
        </div>
        <div className="footer-small-button-container">
          <button onClick={resetGame} className="footer-small-button">Reset</button>
          <button className="footer-small-button">Rules</button>
          <button onClick={skipLevel} className="footer-small-button">Skip</button>
        </div>
      </footer>
    </aside>
  )
}


export default SoloSidebar;

          {/* <option value="challenge">Challenge Mode</option> */}