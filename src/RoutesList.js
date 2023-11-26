import {Routes, Route, Navigate} from "react-router-dom";
import SoloChess from "./SoloChess";
import PuzzleGame from "./PuzzleGame";
import OpeningGame from "./OpeningGame";



function RoutesList () {

  return (
    <Routes>
      <Route path="/" element={<SoloChess />} />
      <Route path="/solochess" element={<SoloChess />} />
      <Route path="/puzzles" element={<PuzzleGame />} />
      <Route path="openings" element={<OpeningGame />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default RoutesList;