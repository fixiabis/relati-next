import React, { useState, useEffect } from "react";
import RelatiScene13C from "./RelatiScene13C";
import { RelatiBoard } from "./components";
import { SceneComponent, CoordinateObject, RelatiGrid } from "./types";
import { isGridHasAvailableRelatiRouteBySymbol } from "./utils";

const RelatiScene14C: SceneComponent = ({ toStep, game, ...props }) => {
  const [description, setDescription] = useState("他又打斷了, 而且現在非常危險!");

  const handleGridClick = ({ x, y }: CoordinateObject) => {
    if (game.getNowPlayerSymbol() !== "O" || game.turn === 16) {
      return;
    }

    const grid = game.board.getGridAt(x, y);

    if (grid?.piece) {
      return;
    }

    game.placeSymbolByCoordinate(x, y);

    if (!grid?.piece) {
      return;
    }

    if (grid.i === 39) {
      return setDescription("很好! 你接上了!");
    }

    if (!(game.board.getGridAt(2, 2) as Required<RelatiGrid>).piece.disabled) {
      return setDescription("不錯! 你接上了!");
    }

    return setDescription("這是特殊的戰略!");
  };

  useEffect(() => {
    const doPlacementAfterTimeout = setTimeout(() => {
      switch (game.turn) {
        case 15:
          const shouldBlockedGrid = game.board.getGridAt(2, 3) as Required<RelatiGrid>;

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
              return setDescription("但是, 他打斷了!");
            }
          }

          return toStep("15C");
        case 16:
          game.undo();
          game.undo();
          return setDescription("再試一次?");
      }
    }, 1500);

    return () => clearTimeout(doPlacementAfterTimeout);
  });

  const [x, y] = game.placementRecords[game.placementRecords.length - 1];
  const boardLastPieceCoordinate = { x, y };
  const symbolOfCurrentPlayer = game.getNowPlayerSymbol();
  const symbolOfPreviousPlayer = game.getPlayerSymbolByTurn(game.turn - 1);

  return (
    <>
      <div key={description} className="description">{description}</div>
      <RelatiBoard
        board={game.board}
        lastPieceCoordinate={boardLastPieceCoordinate}
        symbolOfCurrentPlayer={symbolOfCurrentPlayer}
        symbolOfPreviousPlayer={symbolOfPreviousPlayer}
        onGridClick={handleGridClick}
        {...props} >
        <rect x="0" y="0" width="10" height="10" fill="crimson" opacity="0.4" />
      </RelatiBoard>
    </>
  );
};

RelatiScene14C.initial = (game) => {
  RelatiScene13C.initial(game);

  if (game.turn === 12) {
    game.placeSymbolByCoordinate(2, 3);
  }

  if (game.turn === 13) {
    game.placeSymbolByCoordinate(2, 4);
  }
};

export default RelatiScene14C;
