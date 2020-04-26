import React, { useState, useEffect } from "react";
import RelatiBoard from "../../RelatiBoard";
import { CoordinateObject } from "../../../../types";
import { Component as SceneComponent } from "./types";
import { RelatiGrid } from "../../../../libs/Relati";
import RelatiScene14A from "./RelatiScene14A";

const RelatiScene15A: SceneComponent = ({ toStep, game, ...props }) => {
  const [isTurnBack, setIsTurnBack] = useState(false);
  const [description, setDescription] = useState("他又接回去了?");

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

    if ((game.board.getGridAt(2, 3) as Required<RelatiGrid>).piece.disabled) {
      return setDescription("你擋下來了!");
    }

    if (grid.i === 27) {
      return setDescription("幹的好!");
    }

    return setDescription("這是特殊的戰略!");
  };

  useEffect(() => {
    const placementTimer = setTimeout(() => {
      if (isTurnBack) {
        switch (game.turn) {
          case 16:
            return setIsTurnBack(false);
          case 17:
            game.undo();
            return setDescription("再試一次?");
          case 18:
            game.undo();
            return setDescription("回到上一步中...");
        }
      }
      else {
        switch (game.turn) {
          case 17:
            if (!(game.board.getGridAt(2, 3) as Required<RelatiGrid>).piece.disabled) {
              if (!(game.board.getGridAt(0, 3) as RelatiGrid).piece) {
                game.placeSymbolByCoordinate(0, 3);
                return setDescription("失敗, 穩定的連線無法被打斷!");
              }
              else {
                return toStep("16A");
              }
            }
            else if ((game.board.getGridAt(3, 3) as RelatiGrid).piece) {
              return toStep("16B");
            }
            else {
              return toStep("16C");
            }
          case 18:
            return setIsTurnBack(true);
        }
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

RelatiScene15A.initial = (game) => {
  RelatiScene14A.initial(game);

  if (game.turn === 14) {
    game.placeSymbolByCoordinate(1, 3);
  }

  if (game.turn === 15) {
    game.placeSymbolByCoordinate(1, 4);
  }
};

export default RelatiScene15A;
