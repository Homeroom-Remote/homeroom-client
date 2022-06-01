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
  Archive,
  Reactions,
  Eye,
  EyeOff,
} from "../../utils/svgs";
import { useState } from "react";
import useMeeting from "../../stores/meetingStore";
import Button from "../Button";
import useUser from "../../stores/userStore";

function ToolbarButton(props) {
  const active = props.state;
  const toggle = props.toggle;
  const LogoOn = props.logoOn;
  const LogoOff = props.logoOff;
  const textOn = props.textOn;
  const textOff = props.textOff;

  const getBackgroundStyles = () => {
    const baseBgColors =
      "dark:bg-dark-700 dark:hover:bg-dark-600 bg-lt-600 hover:bg-lt-500 ";
    const activeBgColors = "bg-gradient-to-br from-primary-400 to-primary-600";
    const baseStyles =
      "rounded-lg p-2 outline-none border dark:border-gray-700 border-lt-400 shadow-md dark:shadow-dark-700 shadow-lt-500 flex flex-col items-center relative transition-all";
    if (active) return baseStyles + " " + activeBgColors;
    return baseStyles + " " + baseBgColors;
  };

  return (
    <button onClick={toggle} className={getBackgroundStyles()}>
      {active === true ? (
        <>
          <LogoOn className="h-7 w-14 opacity-100" />
          <span className="dark:text-text-200 text-text-200 text-sm font-medium">
            {textOn}
          </span>
        </>
      ) : (
        <>
          <LogoOff className="h-7 w-14 opacity-60" />
          <span className="dark:text-text-200 text-text-200 text-opacity-60 dark:text-opacity-60 text-sm font-medium">
            {textOff}
          </span>
        </>
      )}
    </button>
  );
}

export default function Toolbar(props) {
  const { exitMeeting } = useMeeting();
  const { owner } = useMeeting();
  const { user } = useUser();

  const camera = props.camera;
  const toggleCamera = props.toggleCamera;

  const microphone = props.microphone;
  const toggleMicrophone = props.toggleMicrophone;

  const chat = props.chat;
  const toggleChat = props.toggleChat;

  const survey = props.survey;
  const toggleSurvey = props.toggleSurvey;

  const participants = props.participants;
  const toggleParticipants = props.toggleParticipants;

  const questionQueue = props.questionQueue;
  const toggleQuestionQueue = props.toggleQuestionQueue;

  const expressions = props.expressions;
  const toggleExpressions = props.toggleExpressions;

  const concentration = props.concentration;
  const toggleConcentration = props.toggleConcentration;

  const shareScreen = props.shareScreen;
  const toggleShareScreen = props.toggleShareScreen;

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
      <div className="flex flex-row gap-x-2 border p-2 relative border-secondary-400">
        <p className="absolute -top-7 -left-1 text-lg text-white font-medium z-30">
          Meeting Options
        </p>
        <ToolbarButton
          state={shareScreen}
          toggle={toggleShareScreen}
          logoOn={ShareScreen}
          logoOff={ShareScreen}
          textOn={"Share Screen"}
          textOff={"Share Screen"}
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
        {user.uid === owner && (
          <ToolbarButton
            state={survey}
            toggle={toggleSurvey}
            logoOn={Chat}
            logoOff={Chat}
            textOn={"Survey"}
            textOff={"Survey"}
          />
        )}
      </div>
      <div className="flex flex-row gap-x-2 border p-2 relative border-primary-400">
        <p className="absolute -top-7 -left-1 text-lg text-white font-medium z-30">
          Machine Learning
        </p>
        <ToolbarButton
          state={questionQueue}
          toggle={toggleQuestionQueue}
          logoOn={Archive}
          logoOff={Archive}
          textOn={"Questions"}
          textOff={"Questions"}
        />
        <ToolbarButton
          state={expressions}
          toggle={toggleExpressions}
          logoOn={Reactions}
          logoOff={Reactions}
          textOn={"Expressions"}
          textOff={"Expressions"}
        />
        <ToolbarButton
          state={concentration}
          toggle={toggleConcentration}
          logoOn={Eye}
          logoOff={EyeOff}
          textOn={"Concentration"}
          textOff={"Concentration"}
        />
      </div>
      <div className="px-2">
        <Button text="Quit" onClick={exitMeeting} />
      </div>
    </div>
  );
}
