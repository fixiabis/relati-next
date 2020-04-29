import React from "react";
import RelatiBoard from "../../RelatiBoard";
import { Component as SceneComponent } from "./types";
import RelatiScene9 from "./RelatiScene9";

const RelatiScene10: SceneComponent = ({ toStep: toStep, game, ...props }) => {
  setTimeout(() => toStep("11"), 1500);

  return (
    <>
      <div className="description">對方也追過來了!</div>
      <RelatiBoard
        board={game.board}
        symbolOfPreviousPlayer="X"
        symbolOfCurrentPlayer="O"
        {...props}>
        <rect x="0" y="0" width="10" height="10" fill="crimson" opacity="0.4" />
      </RelatiBoard>
    </>
  );
};

RelatiScene10.initial = (game) => {
  RelatiScene9.initial(game);

  if (game.turn === 7) {
    game.placeSymbolByCoordinate(5, 2);
  }
};

export default RelatiScene10;
