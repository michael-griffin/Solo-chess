//Probably makes sense to split 


/*Setting up a chess program


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



class chessGame {
    constructor(){
        //set-up an 8x8 board. 
        let newBoard = Array(8).fill(undefined);
        newBoard = newBoard.map(val => Array(8).fill(undefined));
        this.board = newBoard;
        
        this.selected = null; //Will fill with clicked on piece. selected.legalMoves will help display possible.

        this.pieces = []; //a list of pieces. Pieces are themselves classes with positions already built in.
        this.piecesWhite = []; //may also want separate arrays, 1 for white, 1 black.
        this.piecesBlack = [];
        
        this.prevStart = []; //previous piece, prior to it moving.
        this.prevFinish = []; //previous piece, after it moved.

        //Idea for check is to try a move for legality, then check through all opponents moves: if one leads to capture of king, invalid move.
    }

    addPieces(pieceArr){
        //add pieces to board. pieceArr is a list of pieces to initialize on board.
        //Example:
            //let startingpieces = [ {type: 'rook', color: 'white', row: 0, col: 0}, 
            //    {type: 'rook', color: 'black', row: 5, col: 0} ];
        for (let {type, color, row, col} of pieceArr){
            if (type == 'rook'){
                this.board[row][col] = new rook(color, row, col);
            } //else if 
        }
        this.updatePiecesList();
        this.getAllLegalMoves();
    }

    movePiece(startPos, finishPos){
        //Checks:
            // if piece exists at startPos
            // if piece has a legal move at finishPos
        //If checks pass, make a new piece and update its position fields.
        //Then, update board
            //delete old piece, add new piece
            //update piecesLists, recalculate legal moves for each piece on board.

        let [startRow, startCol] = startPos;
        let [finishRow, finishCol] = finishPos;
        let currPiece = this.board[startRow][startCol];

        if (!currPiece){ // does piece exists at startPos
            console.log('no piece present');
            return currPiece; //undefined.
        }
        
        let validMove = false; //check if currPiece's legalMoves array contains finishPos;
        for (let i = 0; i < currPiece.legalMoves.length; i++){
            let [currRow, currCol] = currPiece.legalMoves[i];
            if (currRow == finishRow && currCol == finishCol){
                validMove = true;
                break;
            }
        }
        if (!validMove){
            console.log('not a valid move! returning currPiece legalMoves');
            return currPiece.legalMoves;
        }

        //Cloning a class Object is messy. Object.assign gets everything except methods of original,
        //So we get those by making the 'target' of the assign a new object
        //(.create) with the prototype of the original.
        let newPiece = Object.assign(Object.create(Object.getPrototypeOf(currPiece)), currPiece); 
        newPiece.updatePos(finishRow, finishCol);
        
        //Update game's previous move properties with pre + post move positions
        this.prevStart.push(currPiece);
        this.prevFinish.push(newPiece);

        //Update game board + recalculate legal moves.
        this.board[startRow][startCol] = undefined;
        this.board[finishRow][finishCol] = newPiece;
        this.updatePiecesList();
        this.getAllLegalMoves();
    }

    updatePiecesList(){
        //after adding in/moving pieces, update this.pieces (and the white/Black specific)
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
        this.pieces.forEach(piece => {
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
    updatePos(newRow, newCol){
        this.row = newRow;
        this.col = newCol;
        this.moved = this.moved + 1;
    }
}

class rook extends chessPiece {
    //Need constructor super call here?
    
    //Could try to refactor the below. Rather than several for loops, could have:
    //Possible moves: [up-array, down-array, left-array, right-array]
        //Then loop through each subarray.
    getLegalMoves(board){ //will pretty much always be fullboard.board.
        //Store an array of legal moves. Then, when the piece is selected, can check
        //against array, and if includes, execute move.
        let legalMoves = []; //first add according to move rules, then check against
        
        //board state.
        //let cpiece = this;
        //Check Column, from 0 up to current row;
        for (let n = this.row-1; n >= 0; n--){
            let destpiece = board[n][this.col];
            if (!destpiece){
                legalMoves.push([n, this.col]); //if empty, it's legal
            } else if (destpiece.color !== this.color){
                legalMoves.push([n, this.col]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Check column, from current row to row 7.
        for (let n = this.row+1; n <= 7; n++){
            let destpiece = board[n][this.col];
            if (!destpiece){
                legalMoves.push([n, this.col]); //if empty, it's legal
            } else if (destpiece.color !== this.color){
                legalMoves.push([n, this.col]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Check row, from 0 up to current column.
        for (let n=this.col-1; n >= 0; n--){
            let destpiece = board[this.row][n];
            if (!destpiece){
                legalMoves.push([this.row, n]); //if empty, it's legal
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row, n]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        }
        //Check row, from current column to column 7
        for (let n=this.col+1; n <= 7; n++){
            let destpiece = board[this.row][n];
            if (!destpiece){
                legalMoves.push([this.row, n]); //if empty, it's legal
            } else if (destpiece.color !== this.color){
                legalMoves.push([this.row, n]);
                break; //can capture, but can't continue past enemy piece
            } else {
                break; //can't capture own color, and can't continue past piece.
            }
        } 
        this.legalMoves = legalMoves;
    }
}

class bishop extends chessPiece {

    getLegalMoves(board){
        let legalMoves = [];
        //Given a position, check:
            //For loop along both rows and cols, to see which edge we risk going out of bounds on
            //to.

        //Upper Left
        
        //let start;
        //start = Math.min(this.row, this.col); //for (let shift = 1; (start-shift) >= 0; shift++){
        for (let shift = 1; (this.row - shift >= 0 && this.col - shift >= 0); shift++){
            let destpiece = board[this.row-shift,this.col-shift];
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
        //start = Math.max(this.row, this.col);  for (let shift = 1; (start+shift) >= 7; shift++)
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
        for (let shift = 1; (this.row + shift >= 7 && this.col - shift <= 0); shift++){
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
    
    getLegalMoves(board){

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
        legalMoves.filter(pair =>{
            let keep = true;
            if (pair[0] >= 0 && pair[0] <= 7 && pair[1] >= 0 && pair[1] <= 7){ 
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



/*
class boardSquare {
    piecetype;
    piececolor;
    row;
    column;
    constructor(squarecolor){
        this.squarecolor = squarecolor;
        this.haspiece = 0;
        this.selected = 0; //1 when selecting a piece of your color. May need to split between move start/position chosen.

    }
    selectsquare (){
        //call if clicked here.

    }
}
*/

let startingpieces = [
    {type: 'rook', color: 'white', row: 0, col: 0}, 
//    {type: 'rook', color: 'white', row: 7, col: 7}, 
//    {type: 'rook', color: 'black', row: 7, col: 4}, 
    {type: 'rook', color: 'black', row: 5, col: 0} 
];

let cgame = new chessGame();
//cgame.setupboard();
cgame.addPieces(startingpieces);
//console.log(cgame.board);
//cgame.board[0][0].getLegalMoves(cgame.board);
//console.log(cgame.board[0][0]);

cgame.movePiece([0,0], [0,1]);
//console.log(cgame.board);


export {
    chessGame,
    chessPiece,
    rook
}
