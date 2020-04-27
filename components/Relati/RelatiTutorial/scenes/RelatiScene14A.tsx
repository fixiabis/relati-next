import React, { useState, useEffect } from "react";
import RelatiBoard from "../../RelatiBoard";
import { CoordinateObject } from "../../../../types";
import { Component as SceneComponent } from "./types";
import { RelatiGrid } from "../../../../libs/Relati";
import RelatiScene13A from "./RelatiScene13A";

const RelatiScene14A: SceneComponent = ({ toStep, game, ...props }) => {
  const [description, setDescription] = useState("他還是入侵了, 有反抗的手段嗎?");

  const onGridClick = ({ x, y }: CoordinateObject) => {
    if (game.getNowPlayerSymbol() !== "O") {
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

    if (grid.i === 28) {
      return setDescription("擋的好!");
    }

    if ((game.board.getGridAt(2, 3) as Required<RelatiGrid>).piece.disabled) {
      return setDescription("你擋下來了!");
    }

    return setDescription("這是特殊的戰略!");
  };

  useEffect(() => {
    const placementTimer = setTimeout(() => {
      switch (game.turn) {
        case 15:
          if ((game.board.getGridAt(2, 3) as Required<RelatiGrid>).piece.disabled) {
            if (!(game.board.getGridAt(3, 2) as RelatiGrid).piece) {
              game.placeSymbolByCoordinate(3, 2);
              return setDescription("並沒有用, 他還是接上了!");
            }

            if (!(game.board.getGridAt(3, 3) as RelatiGrid).piece) {
              game.placeSymbolByCoordinate(3, 3);
              return setDescription("並沒有用, 他還是接上了!");
            }
          }
          else if (!(game.board.getGridAt(1, 3) as RelatiGrid).piece) {
            game.placeSymbolByCoordinate(1, 3);
            return setDescription("並沒有用, 他成功永久入侵了!");
          }

          break;
        case 16:
          game.undo();
          game.undo();
          return setDescription("再試一次?");
      }
    }, 1500);

    return () => clearTimeout(placementTimer);
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
        onGridClick={onGridClick}
        {...props} />
    </>
  );
};

RelatiScene14A.initial = (game) => {
  RelatiScene13A.initial(game);

  if (game.turn === 12) {
    game.placeSymbolByCoordinate(1, 2);
  }

  if (game.turn === 13) {
    game.placeSymbolByCoordinate(0, 2);
  }
};

export default RelatiScene14A;
