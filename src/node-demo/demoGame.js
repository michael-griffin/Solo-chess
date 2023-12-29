
const {ChessGame} = require("./gamepieces");
const {parseShorthand} = require("./parseShorthand");
// import {chessGame, chessPiece, rook} from "./gamepieces.js"
// import parseShorthand from ".parseShorthand.js"

const DEMO_FULL_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const DEMO_START_BISHOP = "B5r1/8/8/8/8/8/8/8";
const DEMO_MIDDLE_BISHOP = "6r1/8/8/3B4/8/8/8/8";
const DEMO_CORNER_KNIGHT = "N7/2r5/8/8/8/8/8/8";
const DEMO_MIDDLE_KNIGHT = "8/8/8/3N4/5r2/8/8/8";
const DEMO_MIDDLE_QUEEN = "6r1/8/8/3Q4/5r2/8/8/8";

let startingPieces = parseShorthand(DEMO_START_BISHOP);
let myGame = new ChessGame();
myGame.addPieces(startingPieces);


let gameFinished = false;

//Demo for DEMO_START_BISHOP:
//Select bishop
//Move bishop to 4/4.
//Select bishop
//Capture Rook
//Display Board:

myGame.selectPiece(0, 0);
// console.log("legal moves for selected are:", myGame.selected.legalMoves);
myGame.movePiece(3, 3);
// console.log("unselected check, selected is: ", myGame.selected);
myGame.selectPiece(3, 3);
// console.log("legal moves for selected are:", myGame.selected.legalMoves);
// myGame.movePiece(0,6);

// console.log(myGame.board);
