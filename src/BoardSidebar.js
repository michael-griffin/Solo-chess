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
function BoardSidebar() {

  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  let difficulties = getDifficulties();

  async function GetData(filepath) {
      const data = await fetchCsv(filepath);
      const parsed = Papa.parse(data); //Object with keys of: data/errors/meta
      console.log(parsed.data);
      return parsed.data;
  }

  async function fetchCsv(filepath) {
      const response = await fetch(filepath);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = await decoder.decode(result.value);
      return csv;
  }

  useEffect(() => {
    async function setInitialSoloChessLevels() {
      let rawLevels = await GetData(SOLO_FILEPATH);
      let labels = rawLevels.shift();

      let levelTemplate = {};
      for (let label of labels){
        levelTemplate[label] = null;
      }

      let formattedLevels = rawLevels.map((csvRow, ind ) => {
        let level = {...levelTemplate};
        for (let i = 0; i < csvRow.length; i++){
          let val = isNaN(+csvRow[i]) ? csvRow[i] : +csvRow[i];
          level[labels[i]] = val;
        }
        level["completed"] = false;
        return level;
      });

      console.log(formattedLevels);
      setLevels(formattedLevels);
    }
    setInitialSoloChessLevels();
    setIsLoading(false);
  }, []);

  function getDifficulties(){
    if (isLoading) return null;
    let difficulties = levels.map(({difficulty}) => difficulty);
    difficulties = [...new Set(difficulties)].sort((a, b) => a-b);
    return difficulties;
  }



  let writeCheckBoxesJSX = (perLevel, numLevels) => {
    let checkboxGrid = [];

    // for (let j = 1; j <= numLevels; j++){
    //   let checkboxHeader = <div className="checkbox-header">{j}</div>;
    //   checkboxGrid.push(checkboxHeader)
    // }

    // let count = 0;
    // for (let i = 0; i <= perLevel; i++){
    //   for (let j = 1; j <= numLevels; j++){
    //     let checkboxSquare;

    //     if (i == 0) {
    //       //write Level Labels;
    //       checkboxSquare = <div className="checkbox-header">{j}</div>;
    //     } else if (i % 2 == 1) {
    //       //write empty box
    //       checkboxSquare = <div className="checkbox-container"></div>;
    //     } else {
    //       //write checkbox
    //       checkboxSquare = <div className="checkbox-container">
    //         <CheckBox />
    //       </div>;
    //     }

    //     //checkboxSquare = <div className="checkbox-header">{j}</div>
    //     checkboxGrid.push(checkboxSquare);
    //     count++;
    //   }
    // }

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


  if (isLoading){
    return (
      <div>Loading Levels</div>
    )
  }

  let numLevels = 10;
  let perLevel = 3;
  let checkboxesJSX;
  let difficultiesJSX;
  if (!isLoading){
    numLevels = levels.length;
    let numDiffs = difficulties.length;
    perLevel = numLevels/numDiffs;
    checkboxesJSX = writeCheckBoxesJSX(perLevel, numDiffs); //2 by 5 array, 1 extra row for headers.
  }


  return (
    <aside className="board-sidebar">
      <div className="sidebar-head">
        <h2 className="sidebar-head-text" >Solo Chess</h2>
        <img className="sidebar-head-icon" src="icons/solochess.png"></img>
      </div>

      <div className="sidebar-body">
        <select name="level" className="sidebar-select">
          <option value="challenge">Challenge Mode</option>
          {difficulties.map(diffNum => {
            return <option value={`diff-${diffNum}`}>Difficulty {diffNum}</option>
          })}
          <option value="random">Random Mode</option>
          {/* <option value="challenge">Challenge Mode</option>
          <option value="level-1">Level 1</option>
          <option value="level-2">Level 2</option>
          <option value="level-3">Level 3</option>
          <option value="level-4">Level 4</option>
          <option value="level-5">Level 5</option>
          <option value="random">Random Mode</option> */}
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