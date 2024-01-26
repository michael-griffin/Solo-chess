import {immerable, produce} from "immer";

/*1.5

Working on move history (for takeback command, eventually).
- Immer looks like it's working (previously, 'captured' displayed the currently
moved piece, not the piece that had been captured)
- Still need more info to recreate old piece from previous move:
- May be as simple as adding in
*/

/*
//TODO: solochess has 4 primary rules that differ from regular chess:
//white pieces can take their own color (done)
//The king must remain (done)
//Each piece can only move twice, after the 2nd it switches to black and is
//unselectable. (done)
//INCOMPLETE: every move must be a capture


//TODO: How to add a take back command?
- Hard part is keeping 'move history' of pieces intact. In that sense,
- taking one piece and 'moving it back' + decrementing moveCount is better
- that rebuilding from scratch?
Worked on one implementation for movePiece + undoMove. Still needs work.


//TODO: Add start position (in shorthand to constructor)
//Add reset game method.
//For both, will likely need to import parseShorthand.


//TODO: implement checks (for other game modes)
//Idea for check is to try a move for legality, then check through
//all opponents moves: if one leads to capture of king, invalid move.



chessGame:   contains board + functions to change it
    initialized as empty board.

chessGame methods:
    addPieces(): add pieces from pieceArr to board (each element has type,color,row,col)
    movePiece(): moves piece, updates previous moves, and rechecks legal moves
    getAllLegalMoves(): cycle through all pieces, and call getLegalMoves()
    updatePiecesList(): keep game piece list up to date as pieces are captured

Pieces:
Piece attributes: type, color, row + col
        Also: whether has moved + legalmoves

Piece methods:
    getLegalMoves(): returns array of row/col spaces that they could take.


*/

const BOARD_SIZE = 8;

class ChessGame {
    [immerable] = true;

    constructor(){
        //set-up an 8x8 board.
        let newBoard = Array(BOARD_SIZE).fill(undefined);
        newBoard = newBoard.map(val => Array(BOARD_SIZE).fill(undefined));
        this.board = newBoard;

        this.selected = null; //Will fill with clicked on piece. selected.legalMoves will help display possible.
        this.selectedMoves = []; //will fill with legal moves of selected piece.

        this.pieces = []; //a list of pieces. Pieces are themselves classes with positions already built in.
        this.piecesWhite = []; //may also want separate arrays, 1 for white, 1 black.
        this.piecesBlack = [];

        //History of previous moves.
        //records start Position/finish Position, and the captured piece (if any)
        //that was at finish position before the move occurred.
        this.prevMoves = []; //of the form {start: [0,0], finish: [0,7], captured: Piece}
    }

    addPieces(pieceArr){
        //add pieces to board. pieceArr is a list of pieces to initialize on board.
        //Example:
            //let startingpieces = [ {type: 'rook', color: 'white', row: 0, col: 0},
            //    {type: 'rook', color: 'black', row: 5, col: 0} ];
        for (let {type, color, row, col} of pieceArr){
            let newPiece = this.createPiece({type, color, row, col});
            this.board[row][col] = newPiece;
        }
        this.updatePiecesList();
        this.getAllLegalMoves();
    }

    createPiece({type, color, row, col, moved=0}){
        let newPiece;
        switch (type) {
            case 'pawn':
                newPiece = new Pawn(type, color, row, col, moved);
                break;
            case 'bishop':
                newPiece = new Bishop(type, color, row, col, moved);
                break;
            case 'knight':
                newPiece = new Knight(type, color, row, col, moved);
                break;
            case 'rook':
                newPiece = new Rook(type, color, row, col, moved);
                break;
            case 'king':
                newPiece = new King(type, color, row, col, moved);
                break;
            case 'queen':
                newPiece = new Queen(type, color, row, col, moved);
                break;
            default:
                console.log('attempted to add invalid piece');
                break;
        }

        if (newPiece.moved < 2) newPiece.color = 'white'; //FIXME: exclusive to solo chess
        return newPiece;
    }

    /** Checks if there is a selected piece.
     * If so, checks whether selected piece has a valid move at destRow, destCol
     * Then, makes a new piece, updates its position.
     * Updates prevMove fields (prevStart/prevDest) with old/new piece respectively
     * Finally, updates board: clears old piece(s) and adds new Piece.
     */
    movePiece(destRow, destCol){
        let selectedPiece = this.selected;
        if (!selectedPiece){
            console.log('no piece present');
            return selectedPiece; //undefined.
        }

        let validMove = selectedPiece.isValidMove(destRow, destCol);
        if (!validMove){
            console.log('not a valid move! returning currPiece legalMoves');
            return selectedPiece.legalMoves;
        }

        let [startRow, startCol] = [selectedPiece.row, selectedPiece.col];

        //Cloning a class Object is messy. Object.assign gets everything except methods of original,
        //So we get those by making the 'target' of the assign a new object
        //(.create) with the prototype of the original.
        let newPiece = Object.assign(Object.create(Object.getPrototypeOf(selectedPiece)), selectedPiece);
        newPiece.updatePos(destRow, destCol);

        console.log(`piece at ${destRow},${destCol} is: ${this.board[destRow][destCol]}` );

        const prevMove = {
            start: [startRow, startCol],
            finish: [destRow, destCol],
            captured: this.board[destRow][destCol],
            // captured: capturedPiece
        }

        //push would make more sense, but would mutate state.
        this.prevMoves = [...this.prevMoves, prevMove];

        //Update game board, clear selection, and recalculate legal moves.
        let newBoard = produce(this.board, (draft) => {
            draft[startRow][startCol] = undefined;
            draft[destRow][destCol] = newPiece;
        })
        this.board = newBoard;

        this.selected = null;
        this.selectedMoves = [];

        this.updatePiecesList();
        this.getAllLegalMoves();
        console.log('prevMoves post-update is:', this.prevMoves);
        console.log('board state is: ', this.board);
    }

    undoMove() {
        if (this.prevMoves.length === 0) {
            console.log('no moves to undo');
            return;
        }

        this.selected = null;
        this.selectedMoves = [];

        let prevMove = this.prevMoves.slice(-1)[0];
        this.prevMoves = this.prevMoves.slice(0,-1);

        let {
            start: [prevRow, prevCol],
            finish: [currRow, currCol],
            captured: capturedPiece
        } = prevMove;


        let currPiece = this.board[currRow][currCol];
        if (currPiece === null) throw new Error("Can't find piece from previous move history");
        console.log('currPiece is: ', currPiece);
        let prevPiece = this.createPiece({
            ...currPiece,
            row: prevRow,
            col: prevCol,
            moved: currPiece.moved - 1});

        let newBoard = produce(this.board, (draft) => {
            draft[prevRow][prevCol] = prevPiece;
            draft[currRow][currCol] = capturedPiece;
        })
        this.board = newBoard;

        this.selected = null;
        this.selectedMoves = [];

        this.updatePiecesList();
        this.getAllLegalMoves();
        console.log('board state is: ', this.board);
    }

    resetBoard() {
        while (this.prevMoves.length !== 0){
            this.undoMove();
        }
    }

    updatePiecesList(){
        //after adding in/moving pieces, update this.pieces (and the white/black specific)
        const pieces = [];
        const piecesWhite = [];
        const piecesBlack = [];

        for (let i = 0; i < this.board.length; i++){
            let currRow = this.board[i];
            for (let piece of currRow){
                if (piece){
                    pieces.push(piece);
                    if (piece.color === 'white'){
                        piecesWhite.push(piece);
                    } else {
                        piecesBlack.push(piece);
                    }
                }
            }
        }

        this.pieces = pieces;
        this.piecesWhite = piecesWhite;
        this.piecesBlack = piecesBlack;
    }

    getAllLegalMoves(){
        //console.log('board is: ', this)
        this.pieces.forEach(piece => {
            //console.log('piece is:', piece);
            piece.getLegalMoves(this.board);
        });
    }
}

class ChessPiece {
    constructor(type, color, row, col, moved=0,){
        this.type = type
        this.color = color;
        this.row = row;
        this.col = col;

        this.moved = moved;
        this.legalMoves = [];
    }
    updatePos(destRow, destCol){
        //console.log('updating piece position, new row-col:', destRow, destCol);
        this.row = destRow;
        this.col = destCol;
        this.moved = this.moved + 1;
        //New to solo chess: Switch to black if this.moved >=2
        if (this.moved >= 2) this.color = 'black';
    }
    undoMove(prevRow, prevCol){
        //console.log('taking back move, returning to:', prevRow, prevCol);
        this.row = prevRow;
        this.col = prevCol;
        this.moved = this.moved - 1;
        if (this.moved >= 2) this.color = 'black';
        else if (this.moved < 0) throw new Error("cannot move back further than start pos");
        else this.color = 'white';
    }
    isValidMove(destRow, destCol){
        let validMove = false; //check if Piece's legalMoves array contains destPos;
        for (let i = 0; i < this.legalMoves.length; i++){
            let [currRow, currCol] = this.legalMoves[i];
            if (currRow === destRow && currCol === destCol){
                validMove = true;
                break;
            }
        }
        return validMove;
    }
}

class Rook extends ChessPiece {
    //Need constructor super call here?

    /** Store an array of legal moves. Used when board tries to move piece:
     * Check's selected legalMoves, and if invalid, breaks early.
    */
    getLegalMoves(board){ //gotten from game class

        let legalMoves = []; //first add according to move rules, then check against
        let possMoves = [];

        let nums = [...Array(BOARD_SIZE).keys()];

        //keep column constant, get a list of rows
        let cpiece = this;
        let goingDown = nums.slice(0, cpiece.row)
            .reverse()
            .map(row => [row, cpiece.col]);
        let goingUp = nums.slice(cpiece.row+1)
            .map(row => [row, cpiece.col]);

        //keep row constant, get list of columns.
        let goingLeft = nums.slice(0, cpiece.col)
            .reverse()
            .map(col => [cpiece.row, col]);
        let goingRight = nums.slice(cpiece.col+1)
            .map(col => [cpiece.row, col]);


        possMoves.push(goingDown, goingUp, goingLeft, goingRight);

        for (let i = 0; i < possMoves.length; i++){
            let currMoves = possMoves[i];
            for (let move of currMoves){
                let [row, col] = move;
                let destpiece = board[row][col];

                if (!destpiece) {
                    legalMoves.push(move);
                } else if (destpiece instanceof King){ //FIXME: DIFFERS FROM REGULAR.
                    break;
                } else if (destpiece.color !== this.color){
                    legalMoves.push(move);
                    break; //can capture, but can't continue past enemy piece
                } else { //FIXME: DIFFERS FROM REGULAR. CAN CAPTURE OWN COLOR HERE
                    legalMoves.push(move);
                    break;
                }
            }
        }

        this.legalMoves = legalMoves;
    }
}

class Bishop extends ChessPiece {

    getLegalMoves(board){
        let legalMoves = [];
        //let possMoves = []; //first add according to move rules, then check against?
        //Given a position, check:
            //For loop along both rows and cols, to see which edge we risk going out of bounds on
            //to.

        //Upper Left
        for (let shift = 1; (this.row - shift >= 0 && this.col - shift >= 0); shift++){
            let destpiece = board[this.row-shift][this.col-shift];
            if (!destpiece) {
                legalMoves.push([this.row-shift, this.col-shift]);
            } else if (destpiece instanceof King){ //FIXME: DIFFERS FROM REGULAR.
                break;
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row-shift, this.col-shift]);
                break; //can capture, but can't continue past enemy piece
            } else { //FIXME: DIFFERS FROM REGULAR. CAN CAPTURE OWN COLOR HERE
                legalMoves.push([this.row-shift, this.col-shift]);
                break; //can't capture own color, and can't continue past piece.
            }

        }
        //Lower Right
        for (let shift = 1; (this.row + shift <= 7 && this.col + shift <= 7); shift++){
            let destpiece = board[this.row+shift][this.col+shift];
            if (!destpiece) {
                legalMoves.push([this.row+shift, this.col+shift]);
            } else if (destpiece instanceof King){
                break;
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row+shift, this.col+shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                legalMoves.push([this.row+shift, this.col+shift]);
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Upper Right
        for (let shift = 1; (this.row - shift >= 0 && this.col + shift <= 7); shift++){
            let destpiece = board[this.row-shift][this.col+shift];
            if (!destpiece) {
                legalMoves.push([this.row-shift, this.col+shift]);
            } else if (destpiece instanceof King){
                break;
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row-shift, this.col+shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                legalMoves.push([this.row-shift, this.col+shift]);
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Lower Left
        for (let shift = 1; (this.row + shift <= 7 && this.col - shift >= 0); shift++){
            let destpiece = board[this.row+shift][this.col-shift];
            if (!destpiece) {
                legalMoves.push([this.row+shift, this.col-shift]);
            } else if (destpiece instanceof King){
                break;
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row+shift, this.col-shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                legalMoves.push([this.row+shift, this.col-shift]);
                break; //can't capture own color, and can't continue past piece.
            }
        }
        this.legalMoves = legalMoves;
    }
}

class Knight extends ChessPiece {

    getLegalMoves(board){
        let cpos = [this.row, this.col];
        let possmoves = [
            [cpos[0]-2, cpos[1]+1], [cpos[0]-2, cpos[1]-1], //up 2 right 1, up 2 left 1
            [cpos[0]+2, cpos[1]+1], [cpos[0]+2, cpos[1]-1], //down 2 right 1, down 2 left 1

            [cpos[0]+1, cpos[1]+2], [cpos[0]-1, cpos[1]+2], //Right 2 (down/up 1)
            [cpos[0]+1, cpos[1]-2], [cpos[0]-1, cpos[1]-2], //up 2 right 1, up 2 left 1
        ]; //arr of pairs.
        let legalMoves = possmoves.slice(0); //copy, then we'll filter down
        legalMoves = legalMoves.filter(pair => {
            let keep = true;
            if (pair[0] >= 0 && pair[0] <= 7 && pair[1] >= 0 && pair[1] <= 7){ //if in bounds of board.
                let destPiece = board[pair[0]][pair[1]];
                if (destPiece instanceof King) keep = false; //FIXME: SPECIFIC TO SOLO
                //if (destPiece && destPiece.color === this.color) keep = false;
            } else {
                keep = false;
            }
            return keep;
        });
        this.legalMoves = legalMoves;
    }
}


class Pawn extends ChessPiece {

    getLegalMoves(board){
        let legalMoves = [];
        let frontpiece; let leftpiece; let rightpiece; let front2piece;
        if (this.color === 'white'){ //start at bottom and moving UP (-row)
            //just check by hand:
            if (this.row > 0 ) { //If 1 in front.
                //Move up 1.
                frontpiece = board[this.row-1][this.col];
                if (!frontpiece) legalMoves.push([this.row-1, this.col]);
                //Move up 2.
                if (this.row > 1 && this.moved === 0){ //if two in front.
                    front2piece = board[this.row-2][this.col];
                    if (!front2piece) legalMoves.push([this.row-2, this.col]);
                }

                //Take enemy pieces.
                //SOLO NOTE: removed && leftpiece.color !== this.color
                if (this.col > 0){ //if not upper left
                    leftpiece = board[this.row-1][this.col-1];
                    // if (leftpiece && leftpiece.color !== this.color) legalMoves.push([this.row-1, this.col-1]);
                    if (leftpiece && !(leftpiece instanceof King)) legalMoves.push([this.row-1, this.col-1]);
                }
                if (this.col < 7){ //if not upper right
                    rightpiece = board[this.row-1][this.col+1];
                    // if (rightpiece && rightpiece.color !== this.color) legalMoves.push([this.row-1, this.col+1]);
                    if (rightpiece && !(rightpiece instanceof King)) legalMoves.push([this.row-1, this.col+1]);
                }

                //En Passant?
                //If piece is pawn + prev-move was (first) pawn-move AND directly to right or left

            }
        } else {
            //can't select black in solo chess
        }
        this.legalMoves = legalMoves;
    }
}

class Queen extends ChessPiece {

    /** Reuses rook/bishop functions. Each writes columns/diagonals
     * to this.legalMoves, so we call rook's getMoves for the columns,
     * save them, then concatenate with the diagonals from bishop's getMoves
     */
    getLegalMoves(board){
        const rookPiece = new Rook();
        const bishopPiece = new Bishop();
        const getColumns = rookPiece.getLegalMoves.bind(this, board);
        const getDiagonals = bishopPiece.getLegalMoves.bind(this, board);

        getColumns();
        let allLegalMoves = structuredClone(this.legalMoves);

        getDiagonals();
        allLegalMoves = [...allLegalMoves, ...this.legalMoves];

        this.legalMoves = allLegalMoves;
    }
}

class King extends ChessPiece {

    getLegalMoves(board){
        let legalMoves = [];
        let cpos = [this.row, this.col];
        let possmoves = [
            [cpos[0]-1,cpos[1]-1],  //up left
            [cpos[0]-1,cpos[1]],    //up
            [cpos[0]-1,cpos[1]+1],  //up right
            [cpos[0],cpos[1]-1],    //left
            [cpos[0],cpos[1]+1],    //right
            [cpos[0]+1,cpos[1]-1],  //down left
            [cpos[0]+1,cpos[1]],    //down
            [cpos[0]+1,cpos[1]+1]   //down right
        ];
        legalMoves = possmoves.slice(0);

        legalMoves.filter(([row, col]) =>{
            let keepMove = true;
            if (row >= 0 && row <= 7 && col >= 0 && col <= 7){
                //FIXME: COMMENT IN FOR NON SOLO CHESS
                //let destpiece = board[row][col];
                //if (destpiece && destpiece.color === this.color) keepMove = false;
            } else {
                keepMove = false;
            }
            return keepMove;
        })

        this.legalMoves = legalMoves;
    }
}


export {
    ChessGame,
}
