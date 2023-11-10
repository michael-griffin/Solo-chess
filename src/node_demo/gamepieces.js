/*

chessGame:   contains board + functions to change it
    initialized as empty board.

chessGame methods:
    addPieces(): add pieces from pieceArr to board (each element has type,color,row,col)
    getAllLegalMoves(): cycle through all pieces, and call getLegalMoves()

Pieces:
Currently: classes for each piece
    attributes include: type, color, row + col
        Also: whether has moved + legalmoves

Piece methods:
    getLegalMoves(): returns array of row/col spaces that they could take.


    //after each move, recheck all legal moves (one or both colors?)
    //this will update legalMoves property on each piece
    //Means that, if trying to select:
        //Can stop select attempt if no legal moves
        //Can immediately display legal moves if selected

    //Currently, legal moves mostly works (handling blocks captures in theory)
        //Except for Check
        //Simplest way is to check all legal moves for opposite color
        //If a move captures the king, stop checking and skip including moves
        //Checkmate could read as all pieces of a color having no legal moves.


Chess Board Initialization

*/

const BOARD_SIZE = 8;

class chessGame {
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

        this.prevStart = []; //previous piece, prior to it moving.
        this.prevDest = []; //previous piece, after it moved.

        //Idea for check is to try a move for legality, then check through all opponents moves: if one leads to capture of king, invalid move.
    }

    addPieces(pieceArr){
        //add pieces to board. pieceArr is a list of pieces to initialize on board.
        //Example:
            //let startingpieces = [ {type: 'rook', color: 'white', row: 0, col: 0},
            //    {type: 'rook', color: 'black', row: 5, col: 0} ];
        for (let {type, color, row, col} of pieceArr){
            switch (type) {
                case 'pawn':
                    this.board[row][col] = new pawn(color, row, col);
                    break;
                case 'bishop':
                    this.board[row][col] = new bishop(color, row, col);
                    break;
                case 'knight':
                    this.board[row][col] = new knight(color, row, col);
                    break;
                case 'rook':
                    this.board[row][col] = new rook(color, row, col);
                    break;
                case 'king':
                    this.board[row][col] = new king(color, row, col);
                    break;
                case 'queen':
                    this.board[row][col] = new queen(color, row, col);
                    break;
            }
            /*
            if (type == 'rook'){
                this.board[row][col] = new rook(color, row, col);
            } //else if
            */
        }
        this.updatePiecesList();
        this.getAllLegalMoves();
    }

    //TODO: have onClick events trigger selectPiece;
    /** Selects a piece. Triggered on click. */
    selectPiece(row, col){
        this.selected = this.board[row][col];
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

        //Update game's previous move properties with pre + post move positions
        this.prevStart.push(selectedPiece);
        this.prevDest.push(newPiece);

        //Update game board, clear selection, and recalculate legal moves.
        this.board[startRow][startCol] = undefined;
        this.board[destRow][destCol] = newPiece;

        this.selected = null;
        this.selectedMoves = [];

        this.updatePiecesList();
        this.getAllLegalMoves();
    }

    updatePiecesList(){
        //after adding in/moving pieces, update this.pieces (and the white/black specific)
        this.pieces = [];
        this.piecesWhite = [];
        this.piecesBlack = [];

        for (let i = 0; i < this.board.length; i++){
            let currRow = this.board[i];
            for (let piece of currRow){
                if (piece){
                    this.pieces.push(piece);
                    if (piece.color == 'white'){
                        this.piecesWhite.push(piece);
                    } else {
                        this.piecesBlack.push(piece);
                    }
                }
            }
        }
    }

    getAllLegalMoves(){
        console.log('board is: ', this)
        this.pieces.forEach(piece => {
            console.log('piece is:', piece);
            piece.getLegalMoves(this.board);
        });
    }
}

class chessPiece {
    constructor(color, row, col){
        this.color = color;
        this.row = row;
        this.col = col;

        this.moved = 0;
        this.legalMoves = [];
    }
    updatePos(destRow, destCol){
        console.log('updating piece position, new row-col:', destRow, destCol);
        this.row = destRow;
        this.col = destCol;
        this.moved = this.moved + 1;
    }
    isValidMove(destRow, destCol){
        let validMove = false; //check if Piece's legalMoves array contains destPos;
        for (let i = 0; i < this.legalMoves.length; i++){
            let [currRow, currCol] = this.legalMoves[i];
            if (currRow == destRow && currCol == destCol){
                validMove = true;
                break;
            }
        }
        return validMove;
    }
}

class rook extends chessPiece {
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
                } else if (destpiece.color !== this.color){
                    legalMoves.push(move);
                    break; //can capture, but can't continue past enemy piece
                } else {
                    break; //can't capture own color, and can't continue past piece.
                }
            }
        }

        this.legalMoves = legalMoves;
    }
}

class bishop extends chessPiece {

    getLegalMoves(board){
        console.log('got to bishop getLegalMoves');
        console.log('row and col', this.row, this.col)
        let legalMoves = [];
        let possMoves = []; //first add according to move rules, then check against
        //Given a position, check:
            //For loop along both rows and cols, to see which edge we risk going out of bounds on
            //to.

        //Upper Left
        let shift = 1;
        for (let shift = 1; (this.row - shift >= 0 && this.col - shift >= 0); shift++){
            let destpiece = board[this.row-shift][this.col-shift];
            if (!destpiece) {
                legalMoves.push([this.row-shift, this.col-shift]);
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row-shift, this.col-shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }

        }
        //Lower Right
        for (let shift = 1; (this.row + shift <= 7 && this.col + shift <= 7); shift++){
            let destpiece = board[this.row+shift][this.col+shift];
            if (!destpiece) {
                legalMoves.push([this.row+shift, this.col+shift]);
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row+shift, this.col+shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Upper Right
        for (let shift = 1; (this.row - shift >= 0 && this.col + shift <= 7); shift++){
            let destpiece = board[this.row-shift][this.col+shift];
            if (!destpiece) {
                legalMoves.push([this.row-shift, this.col+shift]);
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row-shift, this.col+shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Lower Left
        for (let shift = 1; (this.row + shift <= 7 && this.col - shift >= 0); shift++){
            let destpiece = board[this.row+shift][this.col-shift];
            if (!destpiece) {
                legalMoves.push([this.row+shift, this.col-shift]);
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row+shift, this.col-shift]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        }
        this.legalMoves = legalMoves;
    }
}

class knight extends chessPiece {

    getLegalMoves(board){
        let cpos = [this.row, this.col];
        let possmoves = [
            [cpos[0]-2, cpos[1]+1], [cpos[0]-2, cpos[1]-1], //up 2 right 1, up 2 left 1
            [cpos[0]+2, cpos[1]+1], [cpos[0]+2, cpos[1]-1], //down 2 right 1, down 2 left 1

            [cpos[0]+1, cpos[1]+2], [cpos[0]-1, cpos[1]+2], //Right 2 (down/up 1)
            [cpos[0]+1, cpos[1]-2], [cpos[0]-1, cpos[1]-2], //up 2 right 1, up 2 left 1
        ]; //arr of pairs.
        let legalMoves = possmoves.slice(0); //copy, then we'll filter down
        legalMoves.filter(pair => {
            let keep = true;
            if (pair[0] >= 0 && pair[0] <= 7 && pair[1] >= 0 && pair[1] <= 7){ //if in bounds of board.
                let destpiece = board[pair[0]][pair[1]];
                if (destpiece && destpiece.color == this.color) keep = false;
            } else {
                keep = false;
            }
            return keep;
        })
        this.legalMoves = legalMoves;
    }
}


class pawn extends chessPiece {

    getLegalMoves(board){
        let legalMoves = [];
        let frontpiece; let leftpiece; let rightpiece; let front2piece;
        if (this.color == 'white'){ //start at bottom and moving UP (-row)
            //just check by hand:
            if (this.row > 0 ) { //If 1 in front.
                //Move up 1.
                frontpiece = board[this.row-1][this.col];
                if (!frontpiece) legalMoves.push([this.row-1, this.col]);
                //Move up 2.
                if (this.row > 1 && this.moved == 0){ //if two in front.
                    front2piece = board[this.row-2][this.col];
                    if (!front2piece) legalMoves.push([this.row-2, this.col]);
                }

                //Take enemy pieces.
                if (this.col > 0){ //if not upper left
                    leftpiece = board[this.row-1][this.col-1];
                    if (leftpiece && leftpiece.color !== this.color) legalMoves.push([this.row-1, this.col-1]);
                }
                if (this.col < 7){ //if not upper right
                    rightpiece = board[this.row-1][this.col+1];
                    if (rightpiece && rightpiece.color !== this.color) legalMoves.push([this.row-1, this.col+1]);
                }

                //En Passant?
                //If piece is pawn + prev-move was (first) pawn-move AND directly to right or left

            }
        } else { //if black start at top and moving DOWN (+row)
            if (this.row < 7 ) { //If 1 in front.
                //Move up 1.
                frontpiece = board[this.row+1][this.col];
                if (!frontpiece) legalMoves.push([this.row+1, this.col]);
                //Move up 2.
                if (this.row < 6 && this.moved == 0){ //if two in front.
                    front2piece = board[this.row+2][this.col];
                    if (!front2piece) legalMoves.push([this.row+2, this.col]);
                }

                //Take enemy pieces.
                if (this.col > 0){ //if not upper left
                    leftpiece = board[this.row+1][this.col-1];
                    if (leftpiece && leftpiece.color !== this.color) legalMoves.push([this.row+1, this.col-1]);
                }
                if (this.col < 7){ //if not upper right
                    rightpiece = board[this.row+1][this.col+1];
                    if (rightpiece && rightpiece.color !== this.color) legalMoves.push([this.row+1, this.col+1]);
                }

                //En Passant?
            }
        }
        this.legalMoves = legalMoves;
    }
}

class queen extends chessPiece {

    /** Reuses rook/bishop functions. Each writes columns/diagonals
     * to this.legalMoves, so we call rook's getMoves for the columns,
     * save them, then concatenate with the diagonals from bishop's getMoves
     */
    getLegalMoves(board){
        const rookPiece = new rook();
        const bishopPiece = new bishop();
        const getColumns = rookPiece.getLegalMoves.bind(this, board);
        const getDiagonals = bishopPiece.getLegalMoves.bind(this, board);

        getColumns();
        let allLegalMoves = structuredClone(this.legalMoves);

        getDiagonals();
        allLegalMoves = [...allLegalMoves, ...this.legalMoves];

        this.legalMoves = allLegalMoves;
    }
}

class king extends chessPiece {

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

        //TODO: rewrite pair, destructure to row/col];
        legalMoves.filter(pair =>{
            let keepMove = true;
            if (pair[0] >= 0 && pair[0] <= 7 && pair[1] >= 0 && pair[1] <= 7){
                let destpiece = board[pair[0]][pair[1]];
                if (destpiece && destpiece.color == this.color) keep = false;
            } else {
                keepMove = false;
            }
            return keepMove;
        })
        this.legalMoves = legalMoves;
    }
}


module.exports = {
    chessGame: chessGame,
    chessPiece: chessPiece,
    rook: rook,
    bishop: bishop
}
