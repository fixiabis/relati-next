import React, { useState } from "react";
import { Props } from "./types";
import RelatiBoard from "../../RelatiBoard";
import { Hint } from "../../../Piece";
import DrawLine from "../../../DrawLine";
import { SCENE4_CAPTIONS, SCENE4_SAMPLE_RELATI_ROUTES_LIST } from "./utils";
import { CoordinateObject } from "../../../../types";
import { Coordinate } from "gridboard";

const RelatiScene4 = ({ nextStep, ...props }: Props) => {
  const [placeStep, setPlaceStep] = useState(0);
  const nextPlaceStep = () => setPlaceStep(placeStep + 1);
  let drawLines: JSX.Element[] = [];
  let hints: JSX.Element[] = [];

  const onGridClick = (coordinate: CoordinateObject) => {
    if (placeStep % 2 === 0) {
      return;
    }

    for (let coordinates of SCENE4_SAMPLE_RELATI_ROUTES_LIST[(placeStep - 1) / 2]) {
      const [x, y] = coordinates[coordinates.length - 1];

      if (coordinate.x === x && coordinate.y === y) {
        if (placeStep === 19) {
          nextStep();
        }
        else {
          nextPlaceStep();
        }
      }
    }
  };

  if (placeStep % 2 === 1) {
    hints = SCENE4_SAMPLE_RELATI_ROUTES_LIST[(placeStep - 1) / 2].map((coordinates, i) => {
      const [x, y] = coordinates[coordinates.length - 1];
      return <Hint key={i} x={x} y={y} color="crimson" />;
    });
  }
  else {
    const ms = 1000;
    const style = { animationDuration: `${ms}ms` };

    drawLines = SCENE4_SAMPLE_RELATI_ROUTES_LIST[placeStep / 2].map((coordinates, i) => {
      const key = placeStep * 4 + i;
      const linePath: Coordinate[] = [[4, 4], ...coordinates as [number, number][]];
      return <DrawLine key={key} linePath={linePath} color="crimson" style={style} />
    });

    if (placeStep >= 8) {
      hints = SCENE4_SAMPLE_RELATI_ROUTES_LIST[placeStep / 2].map((coordinates, i) => {
        const [x, y] = coordinates[coordinates.length - 1];
        return <Hint key={i} x={x} y={y} color="crimson" />;
      });
    }

    setTimeout(nextPlaceStep, ms);
  }

  return (
    <>
      <div key={Math.floor(placeStep / 2)} className="description">{SCENE4_CAPTIONS[placeStep]}</div>
      <RelatiBoard
        showHints={false}
        symbolOfPreviousPlayer="X"
        symbolOfCurrentPlayer="O"
        onGridClick={onGridClick}
        {...props}>
        <g>{drawLines}</g>
        <g>{hints}</g>
      </RelatiBoard>
    </>
  );
};

export default RelatiScene4;
