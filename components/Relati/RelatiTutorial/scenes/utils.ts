import { Coordinate } from "gridboard";
import RelatiGame, { RelatiGrid, isGridHasAvailableRelatiRouteBySymbol } from "../../../../libs/Relati";

export function doPlacement(game: RelatiGame, step: number) {
    if (step <= 0) {
        return;
    }

    game.placeSymbolByCoordinate(4, 4);

    if (step <= 1) {
        return;
    }

    game.placeSymbolByCoordinate(7, 3);

    if (step <= 4) {
        return;
    }

    game.placeSymbolByCoordinate(6, 6);

    if (step <= 5) {
        return;
    }

    game.placeSymbolByCoordinate(5, 5);

    if (game.turn === 4) {
        game.placeSymbolByCoordinate(6, 4);
    }

    if (game.turn === 5) {
        const shouldBlockedGrid = game.board.getGridAt(6, 6) as Required<RelatiGrid>;

        for (let grid of game.board.grids) {
            if (grid.piece || !isGridHasAvailableRelatiRouteBySymbol(grid, "X")) {
                continue;
            }

            const { x, y } = grid;
            game.placeSymbolByCoordinate(x, y);

            if (!shouldBlockedGrid.piece.disabled) {
                game.undo();
            }
            else {
                break;
            }
        }
    }
}

export const SCENE4_SAMPLE_RELATI_ROUTES_LIST = [
    [
        [[4, 3]],
        [[4, 5]],
        [[3, 4]],
        [[5, 4]]
    ],
    [
        [[3, 3]],
        [[3, 5]],
        [[5, 3]],
        [[5, 5]],
    ],
    [
        [[4, 3], [4, 2]],
        [[4, 5], [4, 6]],
        [[3, 4], [2, 4]],
        [[5, 4], [6, 4]],
    ],
    [
        [[3, 3], [2, 2]],
        [[3, 5], [2, 6]],
        [[5, 3], [6, 2]],
        [[5, 5], [6, 6]],
    ],
    [
        [[4, 3], [4, 2], [3, 2]],
        [[4, 5], [4, 6], [5, 6]],
        [[3, 4], [2, 4], [2, 5]],
        [[5, 4], [6, 4], [6, 3]],
    ],
    [
        [[3, 4], [3, 3], [3, 2]],
        [[5, 4], [5, 5], [5, 6]],
        [[4, 5], [3, 5], [2, 5]],
        [[4, 3], [5, 3], [6, 3]],
    ],
    [
        [[4, 3], [3, 3], [3, 2]],
        [[4, 5], [5, 5], [5, 6]],
        [[3, 4], [3, 5], [2, 5]],
        [[5, 4], [5, 3], [6, 3]],
    ],
    [
        [[4, 3], [4, 2], [5, 2]],
        [[4, 5], [4, 6], [3, 6]],
        [[3, 4], [2, 4], [2, 3]],
        [[5, 4], [6, 4], [6, 5]],
    ],
    [
        [[4, 3], [3, 3], [2, 3]],
        [[4, 5], [5, 5], [6, 5]],
        [[3, 4], [3, 5], [3, 6]],
        [[5, 4], [5, 3], [5, 2]],
    ],
    [
        [[4, 3], [5, 3], [5, 2]],
        [[4, 5], [3, 5], [3, 6]],
        [[3, 4], [3, 3], [2, 3]],
        [[5, 4], [5, 5], [6, 5]],
    ]
];

export const SCENE4_CAPTIONS = [
    "這是正四方近程連線！穩定但擴張速度較慢！",
    "這是正四方近程連線！穩定但擴張速度較慢！",
    "這是斜四方近程連線！穩定但是會產生破口！",
    "這是斜四方近程連線！穩定但是會產生破口！",
    "這是正四方遠程連線！不穩但擴張效果不錯！",
    "這是正四方遠程連線！不穩但擴張效果不錯！",
    "這是斜四方遠程連線！不穩但擴張效果最佳！",
    "這是斜四方遠程連線！不穩但擴張效果最佳！",
    "這是側八方遠程連線！擁有三種連線的方式！",
    "這是側八方遠程連線！擁有三種連線的方式！",
    "這是側八方遠程連線！擁有三種連線的方式！",
    "這是側八方遠程連線！擁有三種連線的方式！",
    "這是側八方遠程連線！擁有三種連線的方式！",
    "這是側八方遠程連線！擁有三種連線的方式！",
    "這是側八方遠程連線！比其他遠程連線穩定！",
    "這是側八方遠程連線！比其他遠程連線穩定！",
    "這是側八方遠程連線！比其他遠程連線穩定！",
    "這是側八方遠程連線！比其他遠程連線穩定！",
    "這是側八方遠程連線！比其他遠程連線穩定！",
    "這是側八方遠程連線！比其他遠程連線穩定！",
];

