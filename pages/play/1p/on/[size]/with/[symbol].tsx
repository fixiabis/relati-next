import React, { useState, useRef, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Game, { RelatiGameRuleX9, RelatiSymbols, RelatiGamePlayerX9, convertBoardToPieceCodes, RelatiGameRule, RelatiGameRuleX5, RelatiGameRuleX7, RelatiGamePlayer, RelatiGamePlayerX5, RelatiGamePlayerX7 } from "../../../../../../libraries/RelatiGame";
import { RelatiGame, RelatiPiece } from "../../../../../../components/Relati";
import { Page, Button, IconButton, MessageBox, useForceUpdate, CoordinateObject } from "../../../../../../components";
import { downloadRecordJSONByRelatiGame } from "../../../../../../utilities";
import { useSelector } from "react-redux";
import { State, SettingState } from "../../../../../../reducers";

const gameRuleFromSize: Record<number, RelatiGameRule> = {
  5: RelatiGameRuleX5,
  7: RelatiGameRuleX7,
  9: RelatiGameRuleX9,
};

const gamePlayerFromSize: Record<number, RelatiGamePlayer> = {
  5: RelatiGamePlayerX5,
  7: RelatiGamePlayerX7,
  9: RelatiGamePlayerX9,
};

export interface Props {
  size?: number;
  player?: number;
  level?: number;
}

const Play1p: NextPage<Props> = ({ level = 1, size = 9, player = 1 }) => {
  const router = useRouter();
  const gameRule = gameRuleFromSize[size];
  const gamePlayer = gamePlayerFromSize[size];
  const forceUpdate = useForceUpdate();
  const game = useRef<Game>(new Game(2, gameRule)).current;
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
    if (game.getNowPlayer() === player) {
      return false;
    }
  };

  const handleGameAfterGridClick = () => {
    if (game.getNowPlayer() !== player) {
      return;
    }

    const pieceCodes = convertBoardToPieceCodes(game.board);

    fetch(`/api/next-step?turn=${game.turn}&pieces=${pieceCodes}&level=${level}`)
      .then(response => response.json())
      .then((gridIndex: number) => {
        const grid = game.board.grids[gridIndex];
        game.doPlacementByCoordinateAndPlayer(grid.x, grid.y, player);
        game.reenableAllPieces();
        game.checkIsOverAndFindWinner();
        forceUpdate();
      }).catch(() => {
        gamePlayer.doPlacementByGameAndPlayer(game, player, level);
        game.reenableAllPieces();
        game.checkIsOverAndFindWinner();
        forceUpdate();
      });
  };

  useEffect(() => {
    if (player === 1 && game.turn === 0) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const pieceCodes = convertBoardToPieceCodes(game.board);

    fetch(`/api/next-step?turn=${game.turn}&pieces=${pieceCodes}&level=${level}`, { signal })
      .then(response => response.json())
      .then((gridIndex: number) => {
        const grid = game.board.grids[gridIndex];
        game.doPlacementByCoordinateAndPlayer(grid.x, grid.y, player);
        forceUpdate();
      }).catch(() => {
        RelatiGamePlayerX5.doPlacementByGameAndPlayer(game, player, level);
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

Play1p.getInitialProps = async ({ query: { level, size, symbol } }) => {
  return {
    level: parseInt(level as string || "1"),
    size: parseInt((size as string)?.replace("x", "") || "5"),
    player: ((symbol as string).toUpperCase()) === "O" ? 0 : 1,
  };
};

export default Play1p;