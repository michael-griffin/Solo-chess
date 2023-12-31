import React from "react"
import { BrowserRouter } from "react-router-dom";
import LeftNav from "./LeftNav"
import RoutesList from "./RoutesList";
import SimpleApp from "./modal-demo/SimpleApp";


//At some point, the below issue got fixed. I'm not sure WHAT fixed it, and am
//still uncertain if the pattern I've been using -- rebuilding state with Object.assign
//is sufficient. My worry is that when I'm updating the game board I could be
//mutating state rather than reassigning it; I'm curious if I should switch
//to something like deep clone, or use a library like immer.

//To see the pattern I'm worried about, you can check SoloGameBoard
//(Ctrl+F Object.assign)


//FIXME: past issue: when moving pieces, position logged is inconsistent.
//moving a piece to the middle will display properly, and log the correct position

//However, on reselecting piece, its initial position would be logged. This will
//'correct' itself on the next move. This is now fixed?


/**
 * Hub to play solo chess minigame, practice openings, or solve chess puzzles.
 * Puzzles/Openings still far off.
 *
 * App -> RoutesList -> SoloChess (or, eventually, puzzles/openings )
 */
function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <LeftNav />
        <RoutesList />
      </BrowserRouter>
    </div>
    // <SimpleApp />
  );
}

export default App;



//Notes on dragging pieces:
//Lichess does this and has a special 'black knight dragging' class for when mouse is down and moving piece.
  //Also has a style: transform that updates its coordinates (in pixels?) as you drag.


/*
// Below are row/column labels for board.

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
