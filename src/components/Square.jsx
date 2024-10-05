function Square({ value, onSquareClick, isWinning = false }) {
    return (
        <button className={`square ${isWinning ? 'highlight-square' : ''}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default Square