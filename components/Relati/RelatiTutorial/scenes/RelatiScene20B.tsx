import React from "react";
import RelatiBoard from "../../RelatiBoard";
import { Component as SceneComponent } from "./types";
import { isGridHasAvailableRelatiRouteBySymbol } from "../../../../libs/Relati";
import RelatiScene19B from "./RelatiScene19B";

const RelatiScene20B: SceneComponent = ({ toStep, game, ...props }) => {

  const [x, y] = game.placementRecords[game.placementRecords.length - 1];
  const boardLastPieceCoordinate = { x, y };
  const symbolOfCurrentPlayer = game.getNowPlayerSymbol();
  const symbolOfPreviousPlayer = game.getPlayerSymbolByTurn(game.turn - 1);

  return (
    <>
      <div className="description">這是最後了! 讓對方無法下子就贏了!</div>
      <RelatiBoard
        board={game.board}
        lastPieceCoordinate={boardLastPieceCoordinate}
        symbolOfCurrentPlayer={symbolOfCurrentPlayer}
        symbolOfPreviousPlayer={symbolOfPreviousPlayer}
        {...props} />
    </>
  );
};

RelatiScene20B.initial = (game) => {
  RelatiScene19B.initial(game);

  let hasPlace = true;

  while (hasPlace) {
    const symbol = game.getNowPlayerSymbol();
    hasPlace = false;

    for (let grid of game.board.grids) {
      if (grid.piece || !isGridHasAvailableRelatiRouteBySymbol(grid, symbol)) {
        continue;
      }

      if ([0, 1, 2, 3, 9, 10, 11, 18].includes(grid.i)) {
        continue;
      }

      const { x, y } = grid;
      game.placeSymbolByCoordinate(x, y);
      hasPlace = true;
      break;
    }
  }

  while (game.symbolOfWinner === "?") {
    const symbol = game.getNowPlayerSymbol();

    for (let grid of game.board.grids) {
      if (grid.piece || !isGridHasAvailableRelatiRouteBySymbol(grid, symbol)) {
        continue;
      }

      const { x, y } = grid;
      game.placeSymbolByCoordinate(x, y);
      break;
    }
  }
};

export default RelatiScene20B;
