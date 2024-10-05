import { useState } from "react";
import Square from "./Square";

function Board({ xIsNext, squares, onPlay, numOfRows, numOfCols }) {
    const [location, setLocation] = useState({ row: null, col: null })

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares, location.row, location.col, numOfRows, numOfCols)) {
            return;
        }

        setLocation({ row: Math.floor(i / numOfRows), col: i % numOfCols })
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay({
            squares: nextSquares,
            location: {
                row: Math.floor(i / numOfRows),
                col: i % numOfCols
            }
        });
    }

    const check = calculateWinner(squares, location.row, location.col, numOfRows, numOfCols);
    let status;
    if (check) {
        status = 'Winner: ' + check.winner;
    } else {
        if (squares.every(cell => cell !== null)) {
            status = 'Drawwwwww'
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
    }

    const board = []
    for (let i = 0; i < numOfRows; i++) {
        const row = []
        for (let j = 0; j < numOfCols; j++) {
            const key = i * numOfRows + j
            row.push(<Square isWinning={check && check.tracedSquares.indexOf(key) != -1} value={squares[key]} onSquareClick={() => handleClick(key)} />)
        }
        board.push(<div className="board-row">{row}</div>)
    }

    return (
        <>
            <div className="status">{status}</div>
            {board}
        </>
    );
}

function calculateWinner(squares, row, col, numOfRows, numOfCols, winLength = 3) {
    if (!row || !col) return

    const player = squares[row * numOfRows + col];

    function checkDirection(deltaRow, deltaCol) {
        let count = 0;
        let tracedSquares = []; 
        for (let i = -2; i <= 2; i++) {
            const newRow = row + i * deltaRow;
            const newCol = col + i * deltaCol;

            if (newRow >= 0 && newRow < numOfRows && newCol >= 0 && newCol < numOfCols) {
                if (squares[newRow * numOfRows + newCol] === player) {
                    count++;
                    tracedSquares.push(newRow * numOfRows + newCol);
                    if (count === winLength) {
                        return {
                            result: true,
                            tracedSquares: tracedSquares
                        };
                    }
                } else {
                    count = 0;
                    tracedSquares = [];
                }
            }
        }
        return { result: false };
    }

    let check = checkDirection(0, 1);
    if (check.result) return { winner: player, tracedSquares: check.tracedSquares };

    check = checkDirection(1, 0);
    if (check.result) return { winner: player, tracedSquares: check.tracedSquares };

    check = checkDirection(1, 1);
    if (check.result) return { winner: player, tracedSquares: check.tracedSquares };

    check = checkDirection(1, -1);
    if (check.result) return { winner: player, tracedSquares: check.tracedSquares };

    return null;  // No winner
}


export default Board