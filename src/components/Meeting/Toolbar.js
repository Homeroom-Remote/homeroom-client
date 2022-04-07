import {
  Mic,
  MutedMic,
  Cam,
  MutedCam,
  Security,
  Participants,
  Chat,
  ShareScreen,
  Record,
  Reactions,
} from "../../utils/svgs";
import { useState } from "react";
import useMeeting from "../../stores/meetingStore";
import Button from "../Button";
import OnlineIndicator from "../OnlineIndicator";

function ToolbarButton(props) {
  const theState = props.state;
  const toggle = props.toggle;
  const LogoOn = props.logoOn;
  const LogoOff = props.logoOff;
  const textOn = props.textOn;
  const textOff = props.textOff;
  return (
    <button
      onClick={toggle}
      className="dark:bg-dark-700 dark:hover:bg-dark-600 bg-lt-600 hover:bg-lt-500 rounded-lg p-2 outline-none flex flex-col items-center relative transition-all"
    >
      {theState === true ? (
        <>
          <OnlineIndicator online={true} ping={false} />
          <LogoOn className="h-7 w-14 opacity-100" />
          <span className="dark:text-text-200 text-text-200 text-sm">
            {textOn}
          </span>
        </>
      ) : (
        <>
          <LogoOff className="h-7 w-14 opacity-60" />
          <span className="dark:text-text-200 text-text-200 text-opacity-60 dark:text-opacity-60 text-sm">
            {textOff}
          </span>
        </>
      )}
    </button>
  );
}

export default function Toolbar(props) {
  const { exitMeeting } = useMeeting();

  const camera = props.camera;
  const toggleCamera = props.toggleCamera;

  const microphone = props.microphone;
  const toggleMicrophone = props.toggleMicrophone;

  const chat = props.chat;
  const toggleChat = props.toggleChat;

  const [security, setSecurity] = useState(false);
  const toggleSecurity = () => {
    setSecurity(!security);
  };
  const [participants, setParticipants] = useState(false);
  const toggleParticipants = () => {
    setParticipants(!participants);
  };
  const [shareScreen, setShareScreen] = useState(false);
  const toggleShareScreen = () => {
    setShareScreen(!shareScreen);
  };
  const [record, setRecord] = useState(false);
  const toggleRecord = () => {
    setRecord(!record);
  };
  const [reactions, setReactions] = useState(false);
  const toggleReactions = () => {
    setReactions(!reactions);
  };

  return (
    <div className="flex flex-row dark:bg-dark-900 bg-lt-400 items-center justify-between h-full">
      <div className="flex flex-row gap-x-2 p-6">
        <ToolbarButton
          state={camera}
          toggle={toggleCamera}
          logoOn={Cam}
          logoOff={MutedCam}
          textOn={"Stop"}
          textOff={"Play"}
        />
        <ToolbarButton
          state={microphone}
          toggle={toggleMicrophone}
          logoOn={Mic}
          logoOff={MutedMic}
          textOn={"Mute"}
          textOff={"Unmute"}
        />
      </div>
      <div className="flex flex-row gap-x-6">
        <ToolbarButton
          className="hover:text-primary-900"
          state={security}
          toggle={toggleSecurity}
          logoOn={Security}
          logoOff={Security}
          textOn={"Security"}
          textOff={"Security"}
        />
        <ToolbarButton
          state={participants}
          toggle={toggleParticipants}
          logoOn={Participants}
          logoOff={Participants}
          textOn={"Participants"}
          textOff={"Participants"}
        />
        <ToolbarButton
          state={chat}
          toggle={toggleChat}
          logoOn={Chat}
          logoOff={Chat}
          textOn={"Chat"}
          textOff={"Chat"}
        />
        <ToolbarButton
          state={shareScreen}
          toggle={toggleShareScreen}
          logoOn={ShareScreen}
          logoOff={ShareScreen}
          textOn={"Share Screen"}
          textOff={"Share Screen"}
        />
        <ToolbarButton
          state={record}
          toggle={toggleRecord}
          logoOn={Record}
          logoOff={Record}
          textOn={"Record"}
          textOff={"Record"}
        />
        <ToolbarButton
          state={reactions}
          toggle={toggleReactions}
          logoOn={Reactions}
          logoOff={Reactions}
          textOn={"Reactions"}
          textOff={"Reactions"}
        />
      </div>
      <div className="px-2">
        <Button text="Quit" onClick={exitMeeting} />
      </div>
    </div>
  );
}
