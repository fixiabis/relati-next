import React, { useState, useEffect } from "react";
import RelatiBoard from "../../RelatiBoard";
import { CoordinateObject } from "../../../../types";
import { Component as SceneComponent } from "../scenes/types";
import { RelatiGrid } from "../../../../libs/Relati";
import RelatiScene12B from "./RelatiScene12B";

const RelatiScene13B: SceneComponent = ({ toStep, game, ...props }) => {
  const [description, setDescription] = useState("他接上了!");

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

    if (grid.i === 21) {
      return setDescription("很好! 你打斷了!");
    }

    if ((game.board.getGridAt(3, 1) as Required<RelatiGrid>).piece.disabled) {
      return setDescription("不錯! 你打斷了!");
    }

    return setDescription("這是特殊的戰略!");
  };

  useEffect(() => {
    const placementTimer = setTimeout(() => {
      switch (game.turn) {
        case 13:
          if (!(game.board.getGridAt(3, 1) as Required<RelatiGrid>).piece.disabled) {
            if (!(game.board.getGridAt(2, 0) as RelatiGrid).piece) {
              game.placeSymbolByCoordinate(2, 0);
              return setDescription("但是, 他靠近了!");
            }
            
            if (!(game.board.getGridAt(2, 1) as RelatiGrid).piece) {
              game.placeSymbolByCoordinate(2, 1);
              return setDescription("但是, 他靠近了!");
            }
          }
          else {
            if (!(game.board.getGridAt(3, 2) as RelatiGrid).piece) {
              game.placeSymbolByCoordinate(3, 2);
              return setDescription("但是, 他接上了!");
            }
          }

          return toStep("14B");
        case 14:
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
        {...props} >
        <rect x="0" y="0" width="10" height="10" fill="crimson" opacity="0.4" />
      </RelatiBoard>
    </>
  );
};

RelatiScene13B.initial = (game) => {
  RelatiScene12B.initial(game);

  if (game.turn === 10) {
    game.placeSymbolByCoordinate(4, 2);
  }

  if (game.turn === 11) {
    game.placeSymbolByCoordinate(4, 3);
  }
};

export default RelatiScene13B;