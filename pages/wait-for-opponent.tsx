import { NextPage } from "next";
import { Page, Button, IconButton } from "../components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState, providePlayPageOnlineOpponent, State, UserState } from "../container/store";
import { LeaveWaitingMessageBox } from "../page-components/wait-for-opponent";
import ArenaSocketClient from "../libraries/ArenaSocketClient";

export interface Props {
  type?: string;
}

const WaitForOpponent: NextPage<Props> = ({ type = "x9" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const playerInfo = useSelector<State, UserState["userInfo"]>(state => state.user.userInfo);
  const onlineInfo = useSelector<State, PageState["play"]["online"]>(state => state.page.play.online);
  const isRoundReady = onlineInfo.opponent !== null;
  const [isLeaveWaitingMessageBoxOpen, setIsLeaveWaitingMessageBoxOpen] = useState(false);
  const openLeaveWaitingMessageBox = () => setIsLeaveWaitingMessageBoxOpen(true);
  const closeLeaveWaitingMessageBox = () => setIsLeaveWaitingMessageBoxOpen(false);

  const leavePage = () => {
    if (!ArenaSocketClient.disconnected) {
      ArenaSocketClient.disconnect();
    }

    router.replace("/choose-mode?for=game");
  };

  useEffect(() => {
    if (!playerInfo) {
      router.replace(`/choose-mode?for=sign-in&then=/wait-for-opponent?on=${type}`);
      return;
    }

    if (isRoundReady) {
      router.replace(`/play?2p-online&on=${type}`);
      return;
    }

    ArenaSocketClient.disconnect();
    ArenaSocketClient.connect();

    ArenaSocketClient.on("matched", function (matchData: { id: string, sym: 'O' | 'X', picUrl: string}) {
        dispatch(providePlayPageOnlineOpponent(matchData.sym, { 
            name: 'unknown',
            playerId: matchData.id,
            avatarUrl: matchData.picUrl
        }));

        ArenaSocketClient.off("matched");
    });

    ArenaSocketClient.emit("join", {
        name: playerInfo.name,
        picUrl: playerInfo.avatarUrl,
        gameName: "relati-" + type
    });
  });

  return (
    <Page id="wait-for-opponent" title="wait for opponent">
      <div className="loading">
        <div className="main-icon rotate" style={{ backgroundImage: `url(/icons/loading.svg)` }} />
        正在等待對手
      </div>

      <LeaveWaitingMessageBox
        show={isLeaveWaitingMessageBoxOpen}
        onCancel={closeLeaveWaitingMessageBox}
        onAccept={leavePage}
        onReject={closeLeaveWaitingMessageBox} />

      <Button.Group>
        <IconButton type="leave" color="#888" title="離開" onClick={openLeaveWaitingMessageBox} />
      </Button.Group>
    </Page >
  );
};

WaitForOpponent.getInitialProps = async ({ query: { on: type } }) => {
  return {
    type: type as string | undefined,
  };
};

export default WaitForOpponent;
