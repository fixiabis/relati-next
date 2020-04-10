import { GridBoard, Grid } from "gridboard";
import { Piece } from "./types";
import { isGridPlaceable, disableAllPiecesWithoutPrimarySymbol, activePiecesBySourceGrid } from "./utils";

const SYMBOLS = "OXDUA".split("") as Piece["symbol"][];

class RelatiGame {
    public turn: number;

    public symbolToSourceGrid: {
        [symbol: string]: Grid<Piece>
    };

    public symbolOfWinner: Piece["symbol"] | null;
    public playersCount: number;
    public board: GridBoard<Piece>;

    constructor(playersCount: number) {
        this.turn = 0;
        this.symbolOfWinner = null;
        this.symbolToSourceGrid = {};
        this.playersCount = playersCount;
        this.board = new GridBoard<Piece>(9, 9);
    }

    public getNowPlayerSymbol() {
        return SYMBOLS[this.turn % this.playersCount];
    }

    public placeSymbolToCoordinate(x: number, y: number, symbol = this.getNowPlayerSymbol()) {
        const grid = this.board.getGridAt(x, y);

        if (this.turn < this.playersCount && !grid.piece) {
            grid.piece = {
                symbol,
                primary: true,
                disabled: false
            };

            this.symbolToSourceGrid[symbol] = grid;
        }
        else if (isGridPlaceable(grid, symbol)) {
            grid.piece = {
                symbol,
                primary: false,
                disabled: false
            };
        }
        else {
            return;
        }

        disableAllPiecesWithoutPrimarySymbol(this.board);

        for (let symbol in this.symbolToSourceGrid) {
            let sourceGrid = this.symbolToSourceGrid[symbol];
            activePiecesBySourceGrid(sourceGrid);
        }

        this.turn++;

        if (this.turn >= this.playersCount) {
            let playerPlaceable = false;

            for (let i = 0; i < this.playersCount; i++) {
                let symbol = this.getNowPlayerSymbol();
                let hasPlaceableGrid =  this.board.grids.some(grid => isGridPlaceable(grid, symbol));

                if (hasPlaceableGrid) {
                    playerPlaceable = true;
                    break;
                } else this.turn++;
            }

            if (!playerPlaceable) this.symbolOfWinner = "";
            else if (this.getNowPlayerSymbol() === symbol) this.symbolOfWinner = symbol;
        }
    }
}

export default RelatiGame;