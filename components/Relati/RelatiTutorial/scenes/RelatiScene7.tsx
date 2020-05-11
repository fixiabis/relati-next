import React, { useEffect } from "react";
import RelatiScene6 from "./RelatiScene6";
import { RelatiBoard } from "./components";
import { SceneComponent, RelatiGrid } from "./types";
import { isGridHasAvailableRelatiRouteBySymbol } from "./utils";

const RelatiScene7: SceneComponent = ({ toStep, game, ...props }) => {
  const [x, y] = game.placementRecords[game.placementRecords.length - 1];
  const boardLastPieceCoordinate = { x, y };
  const symbolOfCurrentPlayer = game.getNowPlayerSymbol();
  const symbolOfPreviousPlayer = game.getPlayerSymbolByTurn(game.turn - 1);

  useEffect(() => {
    const toNextStepAfterTimeout = setTimeout(() => toStep("8"), 1500);
    return () => clearTimeout(toNextStepAfterTimeout);
  });

  return (
    <>
      <div className="description">對方也不是省油的燈呢!</div>
      <RelatiBoard
        drawLineDuration={180}
        board={game.board}
        lastPieceCoordinate={boardLastPieceCoordinate}
        symbolOfCurrentPlayer={symbolOfCurrentPlayer}
        symbolOfPreviousPlayer={symbolOfPreviousPlayer}
        {...props} />
    </>
  );
};

RelatiScene7.initial = (game) => {
  RelatiScene6.initial(game);

  if (game.turn === 3) {
    game.placeSymbolByCoordinate(5, 5);
  }

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
};

export default RelatiScene7;
