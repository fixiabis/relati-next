import React, { CSSProperties } from "react";
import { PieceRoute } from "./utils";
import "./index.scss";

export type Props = {
  x: number,
  y: number,
  color: string,
  style?: CSSProperties,
  className?: string,
  emphasized?: boolean,
  [otherPropName: string]: any,
};

const Focus = ({ x, y, color, className, emphasized = true, style, ...props }: Props) => {
  const definition = `M ${x * 5} ${y * 5} ${PieceRoute.Focus}`;
  const position = `${x * 5}px ${y * 5}px`;

  style = {
    ...style,
    transformOrigin: position
  };

  className = emphasized ? `${className} piece-emphasis` : undefined;

  return (
    <path
      d={definition}
      fill="none"
      stroke={color}
      strokeWidth="0.4px"
      className={className}
      style={style}
      {...props} />
  );
};

export default Focus;
