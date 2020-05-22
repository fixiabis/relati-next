import React, { useState, useRef, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Game, { RelatiGameRuleX7, RelatiSymbols, RelatiGamePlayerX7, convertBoardToPieceCodes } from "../libraries/RelatiGame";
import { RelatiGame, RelatiPiece } from "../components/Relati";
import { Page, Button, IconButton, MessageBox, useForceUpdate, CoordinateObject } from "../components";
import { downloadRecordJSONByRelatiGame } from "../utilities";
import { useSelector } from "react-redux";
import { State, SettingState } from "../reducers";

export interface Props {
  level?: number;
}

const Play1pOnX7WithO: NextPage<Props> = ({ level = 1 }) => {
  const router = useRouter();
  const forceUpdate = useForceUpdate();
  const game = useRef<Game>(new Game(2, RelatiGameRuleX7)).current;
  const [isGameOverMessageBoxShow, setIsGameOverMessageBoxShow] = useState(true);
  const [isGameLeaveMessageBoxShow, setIsGameLeaveMessageBoxShow] = useState(false);
  const effectSetting = useSelector<State, SettingState["effect"]>(state => state.setting.effect);
  const leavePage = () => router.replace("/choose-game-mode");
  const openGameLeaveMessageBox = () => setIsGameLeaveMessageBoxShow(true);
  const closeGameOverMessageBox = () => setIsGameOverMessageBoxShow(false);
  const closeGameLeaveMessageBox = () => setIsGameLeaveMessageBoxShow(false);

  const restartGame = () => {
    game.restart();
    forceUpdate();
  };

  const leaveGame = () => {
    if (game.turn && !game.isOver) {
      openGameLeaveMessageBox();
    }
    else {
      leavePage();
    }
  };

  const saveGame = () => downloadRecordJSONByRelatiGame(game);

  const gameOverMessageText =
    game.isOver
      ? game.winner !== -1
        ? `${game.turn % 2 ? "藍" : "紅"}方玩家獲勝!`
        : "平手!"
      : undefined;

  const gameLeaveMessageIconStyle = { backgroundImage: "url(/icons/help.svg)" };

  const gameLeaveMessageBox =
    isGameLeaveMessageBoxShow
      ? (
        <MessageBox onCancel={closeGameLeaveMessageBox}>
          <div className="message-container">
            <div className="message-icon" style={gameLeaveMessageIconStyle} />
            勝負未分, 確定離開?
          </div>
          <Button.Group>
            <IconButton type="accept" color="crimson" onClick={leavePage} />
            <IconButton type="download" color="#888" onClick={saveGame} />
            <IconButton type="reject" color="royalblue" onClick={closeGameLeaveMessageBox} />
          </Button.Group>
        </MessageBox>
      )
      : undefined;

  const gameOverMessageBox =
    isGameOverMessageBoxShow && game.isOver
      ? (
        <MessageBox onCancel={closeGameOverMessageBox}>
          <div className="message-container">
            <div className="message-icon">
              <svg width="5" height="5">
                <RelatiPiece x={0} y={0} symbol={RelatiSymbols[game.winner] || "N"} primary />
              </svg>
            </div>
            {gameOverMessageText}
          </div>
          <Button.Group>
            <IconButton type="retry" color="crimson" onClick={restartGame} />
            <IconButton type="download" color="#888" onClick={saveGame} />
            <IconButton type="reject" color="royalblue" onClick={leaveGame} />
          </Button.Group>
        </MessageBox>
      )
      : undefined;

  const handleGameGridClick = ({ x, y }: CoordinateObject) => {
    if (game.getNowPlayer() === 0) {
      return false;
    }
  };

  const handleGameAfterGridClick = () => {
    if (game.getNowPlayer() !== 0) {
      return;
    }

    const pieceCodes = convertBoardToPieceCodes(game.board);

    fetch(`/api/next-step?turn=${game.turn}&pieces=${pieceCodes}&level=${level}`)
      .then(response => response.json())
      .then((gridIndex: number) => {
        const grid = game.board.grids[gridIndex];
        game.doPlacementByCoordinateAndPlayer(grid.x, grid.y, 0);
        game.reenableAllPieces();
        game.checkIsOverAndFindWinner();
        forceUpdate();
      }).catch(() => {
        RelatiGamePlayerX7.doPlacementByGameAndPlayer(game, 0, level);
        game.reenableAllPieces();
        game.checkIsOverAndFindWinner();
        forceUpdate();
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const pieceCodes = convertBoardToPieceCodes(game.board);

    fetch(`/api/next-step?turn=${game.turn}&pieces=${pieceCodes}&level=${level}`, { signal })
      .then(response => response.json())
      .then((gridIndex: number) => {
        const grid = game.board.grids[gridIndex];
        game.doPlacementByCoordinateAndPlayer(grid.x, grid.y, 0);
        forceUpdate();
      }).catch(() => {
        RelatiGamePlayerX7.doPlacementByGameAndPlayer(game, 0, level);
        game.reenableAllPieces();
        game.checkIsOverAndFindWinner();
        forceUpdate();
      });

    return () => controller.abort();
  }, []);

  return (
    <Page id="play" title="play">
      <div className="versus-header">
        <div className="player-o" />
        <div className="versus" />
        <div className="player-x" />
      </div>

      <RelatiGame
        {...effectSetting}
        game={game}
        onGridClick={handleGameGridClick}
        onAfterGridClick={handleGameAfterGridClick}
        onOver={forceUpdate} />

      <Button.Group>
        <IconButton type="leave" color="#888" title="離開" onClick={leaveGame} />
      </Button.Group>

      {gameLeaveMessageBox}
      {gameOverMessageBox}
    </Page>
  );
};

Play1pOnX7WithO.getInitialProps = async ({ query: { level } }) => {
  return { level: parseInt(level as string || "1") };
};

export default Play1pOnX7WithO;
