export function F1GameSelector({ f1Game, setf1Game }) {
    // Display "F1 2021" or "F1 2023" depending on the game state selected.
    // Toggle between the two games when clicked.
    return (
        <div className="f1-game-selector">
            <div
                // Set game to 2021 if it is currently 2023, and vice versa.
                onClick={() =>
                    setf1Game(f1Game === "F1 2021" ? "F1 2023" : "F1 2021")
                }
            >
                {f1Game}
            </div>
        </div>
    );
}

export default F1GameSelector;
