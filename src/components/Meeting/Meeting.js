import { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";
import Participants from "./Participants"
import Error from "./Error";

import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
import useChat from "../../stores/chatStore";
import useRoom from "../../api/useColyseus";
import usePeer from "../../api/usePeer";
import MeetingLoading from "./MeetingLoading";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  const { defaultVideo, defaultAudio } = useVideoSettings();
  const [myStream, setMyStream] = useState(null);
  const [chat, setChat] = useState(false);
  const [microphone, setMicrophone] = useState(defaultAudio);
  const [camera, setCamera] = useState(defaultVideo);
  const [participants, setParticipants] = useState(false);

  const { meetingID, exitMeeting } = useMeeting();
  const { isOnline, error, registerMessages, sendChatMessage } =
    useRoom(meetingID);
  const { createPeer, destroyPeer, peers } = usePeer(myStream);
  const { addGeneralMessage } = useChat();

  const toggleCamera = () => {
    setCamera(!camera);
  };

  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const stopStream = (streamToStop) => {
    streamToStop.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    return () => myStream && stopStream(myStream);
  }, []);

  const refreshMedia = (video, audio) => {
    function getMedia(constraints) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    getMedia({ video, audio })
      .then((stream) => {
        if (myStream) stopStream(myStream);
        setMyStream(stream);
      })
      .catch(() => {
        if (myStream) stopStream(myStream);
        setMyStream(null);
      });
  };

  useEffect(() => {
    refreshMedia(camera, microphone);
  }, [camera, microphone]);

  const toggleChat = () => {
    setChat(!chat);
  };

  const toggleParticipants = () => {
    setParticipants(!participants);
  };


  const sendMessageFromChat = (message) => {
    sendChatMessage(message);
  };

  if (error) {
    return <Error error={error} goBack={exitMeeting} />;
  }
  if (!isOnline) {
    return <MeetingLoading />;
  }

  // socket room messages
  registerMessages([
    {
      name: "join",
      callback: (room, message) => createPeer(room, message, true),
    },
    {
      name: "leave",
      callback: (room, message) => destroyPeer(message.sessionId),
    },
    {
      name: "signal",
      callback: (room, message) => createPeer(room, message, false),
    },
    {
      name: "chat-message",
      callback: (room, message) => addGeneralMessage(message),
    },
  ]);

  return (
    <div className={globalStyles}>
      <div className="h-full grid grid-flow-col grid-cols-10 grid-rows-1">
        <div
            className={
              "grid grid-rows-10 grid-flow-row bg-red-200 h-full " +
              ((participants || chat) ? "col-span-7" : "col-span-10")
            }
        >
          <VideoWrapper myStream={myStream} otherParticipants={peers} />

          <div className="row-span-1">
            <Toolbar
              camera={camera}
              toggleCamera={toggleCamera}
              microphone={microphone}
              toggleMicrophone={toggleMicrophone}
              chat={chat}
              toggleChat={toggleChat}
              participants={participants}
              toggleParticipants={toggleParticipants}
            />
          </div>
        </div>
        {/* Chat Div */}
        <div className="flex flex-col bg-red-500 w-full h-full col-span-3 divide-y-2 divide-opacity-50">
        {chat && <Chat sendMessage={sendMessageFromChat} isParticipantsOpen={participants}/>}
        {participants && <Participants peers={peers} cameraState={camera} microphoneState={microphone} isChatOpen={chat}/>}
        </div>
      </div>
    </div>
  );
}
