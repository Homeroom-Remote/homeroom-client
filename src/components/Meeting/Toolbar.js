import { Mic, MutedMic, Cam, MutedCam, Chat } from "../../utils/svgs";
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
          <LogoOn className="h-6 w-12 opacity-100" />
          <span className="dark:text-text-200 text-text-200 text-sm">
            {textOn}
          </span>
        </>
      ) : (
        <>
          <LogoOff className="h-6 w-12 opacity-60" />
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

  return (
    <div className="flex flex-row dark:bg-dark-900 bg-lt-50 items-center justify-between h-full">
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
        <ToolbarButton
          state={chat}
          toggle={toggleChat}
          logoOn={Chat}
          logoOff={Chat}
          textOn={"Chat"}
          textOff={"Chat"}
        />
      </div>
      <div className="px-2">
        <Button text="Quit" onClick={exitMeeting} />
      </div>
    </div>
  );
}
