import React, { useRef, useEffect } from "react";
import { CoordinateObject } from "../../types";
import "./board.scss";

export interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  width: number;
  height: number;
  onGridClick?: ({ x, y }: CoordinateObject) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void | boolean;
}

const Board = ({ ref: externalRef, width, height, onClick: externalOnClick, children, className = "", onGridClick, style, ...props }: Props) => {
  const gridLines = [];
  const viewWidth = width * 5;
  const viewHeight = height * 5;
  const containerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const ref = typeof externalRef !== "object"
    ? useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>
    : externalRef;

  const scaleByMeasurement = () => {
    if (!ref || !ref.current || !containerRef.current) {
      return;
    }

    const { offsetWidth, offsetHeight } = containerRef.current;
    const widthRatio = offsetWidth / viewWidth;
    const heightRatio = offsetHeight / viewHeight;
    const scale = Math.min(widthRatio, heightRatio) * 0.95;
    ref.current.style.transform = `scale(${scale})`;

    if (typeof externalRef === "function") {
      externalRef(ref.current);
    }
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (externalOnClick?.(event) === false) {
      return event.preventDefault();
    }

    const { offsetX, offsetY } = event.nativeEvent;
    const x = Math.floor(offsetX / 5);
    const y = Math.floor(offsetY / 5);

    if (onGridClick) {
      onGridClick({ x, y });
    }
  };

  className = `board${className && ` ${className}`}`;

  style = {
    ...style,
    width: viewWidth,
    height: viewHeight,
  };

  for (let x = 1; x < height; x++) {
    const key = `x-${x}`;
    const d = `M 0 ${x * 5} H ${viewWidth}`;
    gridLines.push(<path key={key} d={d} />);
  }

  for (let y = 1; y < width; y++) {
    const key = `y-${y}`;
    const d = `M ${y * 5} 0 V ${viewHeight}`;
    gridLines.push(<path key={key} d={d} />);
  }

  useEffect(() => {
    scaleByMeasurement();
    window.addEventListener("resize", scaleByMeasurement);
    return () => window.removeEventListener("resize", scaleByMeasurement);
  });

  return (
    <div ref={containerRef} className="board-container">
      <div ref={ref} className={className} style={style} onClick={onClick} {...props}>
        <svg width={viewWidth} height={viewHeight}>
          {children}
          <g className="grid-lines" stroke="#888" strokeWidth="0.4">{gridLines}</g>
        </svg>
      </div>
    </div>
  );
};

export default Board;
