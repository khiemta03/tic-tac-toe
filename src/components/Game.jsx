import Board from "./Board";
import { useState } from "react";

function Game() {
    const numOfCols = 5
    const numOfRows = 4
    const [history, setHistory] = useState([{ squares: Array(numOfCols * numOfRows).fill(null), location: { col: null, row: null } }]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;
    const lastSquare = history[currentMove].location

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((his, move) => {
        let description;
        if (move > 0) {
            description = `Go to move #${move} (${his.location.row}, ${his.location.col})`;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}> {
                move === currentMove ? (<span>{`You are at move #${move} ${move != 0 ? `(${his.location.row}, ${his.location.col})` : ''}`}</span>) :
                    (<button onClick={() => jumpTo(move)}>{description}</button>)}
            </li>
        );
    });

    const _ = isAscending ? moves : moves.reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board lastSquare={lastSquare} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} numOfRows={numOfRows} numOfCols={numOfCols} />
            </div>
            <div className="game-info">
                <div className="toggle-button">
                    <button onClick={() => setIsAscending(!isAscending)}>
                        {isAscending ? 'Sort Descending' : 'Sort Ascending'}
                    </button>
                </div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

export default Game