import Square from "./Square";

function Board({ xIsNext, lastSquare, squares, onPlay, numOfRows, numOfCols }) {

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares, lastSquare.row, lastSquare.col, numOfRows, numOfCols)) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';

        onPlay({
            squares: nextSquares,
            location: {
                row: Math.floor(i / numOfCols),
                col: i % numOfCols
            }
        });
    }

    const winnerInfo = calculateWinner(squares, lastSquare.row, lastSquare.col, numOfRows, numOfCols);
    let status;
    if (winnerInfo) {
        status = 'Winner: ' + winnerInfo.winner;
    } else if (squares.every(cell => cell !== null)) {
        status = 'Drawwwww';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const board = Array.from({ length: numOfRows }, (_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
            {Array.from({ length: numOfCols }, (_, colIndex) => {
                const key = rowIndex * numOfCols + colIndex;
                return (
                    <Square
                        key={key}
                        isWinning={winnerInfo && winnerInfo.tracedSquares.includes(key)}
                        value={squares[key]}
                        onSquareClick={() => handleClick(key)}
                    />
                );
            })}
        </div>
    ));

    return (
        <>
            <div className="status">{status}</div>
            {board}
        </>
    );
}

function calculateWinner(squares, lastRow, lastCol, numOfRows, numOfCols, winLength = 3) {
    if (lastRow == null || lastCol == null) return null;

    const player = squares[lastRow * numOfCols + lastCol];
    if (!player) return null;

    function checkDirection(deltaRow, deltaCol) {
        let count = 0;
        const tracedSquares = [];

        for (let i = -winLength + 1; i < winLength; i++) {
            const newRow = lastRow + i * deltaRow;
            const newCol = lastCol + i * deltaCol;

            if (newRow >= 0 && newRow < numOfRows && newCol >= 0 && newCol < numOfCols) {
                if (squares[newRow * numOfCols + newCol] === player) {
                    count++;
                    tracedSquares.push(newRow * numOfCols + newCol);
                    if (count === winLength) {
                        return { result: true, tracedSquares };
                    }
                } else {
                    count = 0;
                    tracedSquares.length = 0;
                }
            }
        }
        return { result: false, tracedSquares };
    }

    for (const [deltaRow, deltaCol] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
        const check = checkDirection(deltaRow, deltaCol);
        if (check.result) return { winner: player, tracedSquares: check.tracedSquares };
    }

    return null; // No winner
}

export default Board;
