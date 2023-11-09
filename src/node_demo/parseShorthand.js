//Chess has a shorthand for a boardState, want to convert this into the
//format used in addPieces:
//[
//{type: 'rook', color: 'white', row: 0, col: 0},
//{type: 'rook', color: 'white', row: 7, col: 7},
//]
//Example of shorthand: //r1b2bkr/ppp3pp/2n5/3qp3/2B5/8/PPPP1PPP/RNB1K2R

function parseShorthand(shorthandStr) {

  let letterKey = {
    'p' : 'pawn',
    'b' : 'bishop',
    'n' : 'knight',
    'r' : 'rook',
    'k' : 'king',
    'q' : 'queen',
  };
  let isNum = char => {
    let numCheck = /\d/;
    return (numCheck.test(char)) ? true : false;
  }

  let shorthand = shorthandStr.split('/');

  if (shorthand.length !== 8) console.log('error, invalid string');

  let startingPieces = [];
  for (let i = 0; i < shorthand.length; i++){ //rows,
    let currRow = shorthand[i];
    let currCol = 0; //column
    for (let j = 0; j < currRow.length; j++){ //
      let char = currRow[j];
      if (isNum(char)) {
        //no piece to place, increment currCol by num.
        currCol += Number(char);
      } else {
        let isUpper = char.toUpperCase() === char;
        let color = isUpper ? 'white' : 'black';
        let pieceType = letterKey[char.toLowerCase()];
        let newPiece = {
          'type': pieceType,
          'color' : color,
          'row' : i,
          'col' : currCol
        };
        startingPieces.push(newPiece);
        currCol++;
      }

    }
  }

  return startingPieces;
}


module.exports = {
  parseShorthand
}
