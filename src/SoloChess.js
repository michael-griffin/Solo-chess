import React, { useState, useEffect } from "react";
import loadCsv from './utils/loadCsv.js';
import parseShorthand from './utils/parseShorthand.js';
import {ChessGame} from "./gamepiecesSolo.js";
import SoloGameBoard from "./SoloGameBoard.js";
import SoloSidebar from "./SoloSidebar.js";


const SOLO_FILEPATH = 'data/datademo.csv';

//TODO: still need to get buttons working for sidebar
//this will be writing functions that take the passed in setSoloGame


/** SoloChess: Loads in data for minigame Solo Chess, sets up levels
 * and game state, then renders game board + sidebar
 * - Game board: receives game state and updateLevel
 * - Sidebar: receives setBoard and setLevel. Can:
 *    take back moves/retry level/reset game
 *    'indirectly' choose level by selecting starting difficulty
 *
 * Props: None
 *
 * State:
 *  - isLoading: Flips when levels are read from file
 *  - levels: an array, each level obj holds level#, starting position, and difficulty
 *  - soloGame: Game board. Also has current selection, pieces list, updating methods
 *
 */
function SoloChess() {
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState([]);

  let difficulties = getDifficulties();

  const [currentLevel, setCurrentLevel] = useState(null); //index of levels
  const [soloGame, setSoloGame] = useState(null);

  // console.log("made it to solochess, loading is: ", isLoading);
  // console.log("game is: ", soloGame);
  useEffect(() => {
    async function setInitialSoloChessLevels() {
      let rawLevels = await loadCsv(SOLO_FILEPATH);
      let labels = rawLevels.shift();

      let levelTemplate = {};
      for (let label of labels) {
        levelTemplate[label] = null;
      }

      let formattedLevels = rawLevels.map((csvRow, ind) => {
        let level = { ...levelTemplate };
        for (let i = 0; i < csvRow.length; i++) {
          let val = isNaN(+csvRow[i]) ? csvRow[i] : +csvRow[i];
          level[labels[i]] = val;
        }
        level["completed"] = false;
        return level;
      });
      // console.log(formattedLevels);
      setLevels(formattedLevels);
      setCurrentLevel(0);
    }


    setInitialSoloChessLevels();
  }, []);

  /** Update gameboard everytime you complete a level, or on initial load.
   * TODO: should this be split off outside of a useEffect?
  */
  useEffect(() => {
    if (currentLevel !== null){
      const startPosition = levels[currentLevel].startPosition;

      const newGame = new ChessGame();
      const gamePieces = parseShorthand(startPosition);
      newGame.addPieces(gamePieces);

      setSoloGame(newGame);
      setIsLoading(false);
    }

  }, [currentLevel, levels]); //levels added due to linter.


  function getDifficulties() {
    if (isLoading) return null;
    let difficulties = levels.map(({ difficulty }) => difficulty);
    difficulties = [...new Set(difficulties)].sort((a, b) => a - b);
    return difficulties;
  }


  /** Increment current level, triggers above useEffect to
   * reset gameBoard, load next level's starting position */

  function completeLevel(){
    setLevels(prevLevels => {
      let newLevels = [...prevLevels];
      newLevels[currentLevel].completed = true;
      return newLevels;
    });

    setCurrentLevel(prev => (prev === levels.length - 1) ? 0 : prev + 1);
  }



  if (isLoading){
    return (
      <div>Still Loading...</div>
    )
  }
  return (
    <>
      <SoloGameBoard game={soloGame} setGame={setSoloGame} completeLevel={completeLevel} />
      <SoloSidebar levels={levels} difficulties={difficulties}
        setGame={setSoloGame} setCurrentLevel={setCurrentLevel} setLevels={setLevels}/>
    </>
  )

}
    // <>

    //   <SoloGameBoard game={soloGame} setGame={setSoloGame} updateLevel={updateLevel} loading={isLoading}/>
    //   <SoloSidebar levels={levels} difficulties={difficulties} setGame={setSoloGame} setLevels={setLevels}/>
    // </>

export default SoloChess;