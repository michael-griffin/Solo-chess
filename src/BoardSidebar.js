import React from "react";
import CheckBox from "./CheckBox";

  //Most of this stuff will vary depending on menu type chosen.
  //Will have distinct sidebars for:
    //Solo Chess
      //for buttons, has 2: Take back move + retry level.
    //Puzzles
      //for buttons, has a hint that morphs to a 'move' button.
    //Opening Practice
    //Default/Main?
function BoardSidebar() {

  //Currently building Solo Chess
  let numLevels = 5;
  let perLevel = 2;

  let writeCheckBoxesJSX = (perLevel, numLevels) => {
    let checkboxGrid = [];
    let count = 0;
    for (let i = 0; i <= perLevel; i++){
      for (let j = 1; j <= numLevels; j++){
        let checkboxSquare;

        if (i == 0) {
          //write Level Labels;
          checkboxSquare = <div className="checkbox-header">{j}</div>;
        } else if (i % 2 == 1) {
          //write empty box
          checkboxSquare = <div className="checkbox-container"></div>;
        } else {
          //write checkbox
          checkboxSquare = <div className="checkbox-container">
            <CheckBox />
          </div>;
        }

        //checkboxSquare = <div className="checkbox-header">{j}</div>
        checkboxGrid.push(checkboxSquare);
        count++;
      }
    }
    return checkboxGrid;
  };

  let checkboxesJSX = writeCheckBoxesJSX(2, 5); //2 by 5 array, 1 extra row for headers.

  return (
    <aside className="board-sidebar">
      <div className="sidebar-head">
        <h2 className="sidebar-head-text" >Solo Chess</h2>
        <img className="sidebar-head-icon" src="icons/solochess.png"></img>
      </div>

      <div className="sidebar-body">
        <select name="level" className="sidebar-select">
          <option value="challenge">Challenge Mode</option>
          <option value="level-1">Level 1</option>
          <option value="level-2">Level 2</option>
          <option value="level-3">Level 3</option>
          <option value="level-4">Level 4</option>
          <option value="level-5">Level 5</option>
          <option value="random">Random Mode</option>
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
          <button className="footer-small-button">Reset</button>
          <button className="footer-small-button">Rules</button>
        </div>
      </footer>
    </aside>
  )
}


export default BoardSidebar;