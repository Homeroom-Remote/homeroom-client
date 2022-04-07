import { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";
import Error from "./Error";

import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
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
  const [generalMessages, setGeneralMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [unreadGeneralMessages, setUnreadGeneralMessages] = useState(0);
  const [unreadPrivateMessages, setUnreadPrivateMessages] = useState(0);
  const { meetingID, exitMeeting } = useMeeting();
  const { isOnline, error, registerMessages, sendChatMessage } =
    useRoom(meetingID);
  const { createPeer, destroyPeer, peers } = usePeer(myStream);

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

  const sendMessageFromChat = (message) => {
    sendChatMessage(message);
  };

  const addGeneralMessage = (messageObject) => {
    setUnreadGeneralMessages((unread) => unread + 1);
    setGeneralMessages((oldMessages) => [...oldMessages, messageObject]);
  };

  const onOpenGeneralMessages = () => setUnreadGeneralMessages(0);
  const onOpenPrivateMessages = () => setUnreadPrivateMessages(0);

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
            (chat ? "col-span-7" : "col-span-10")
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
            />
          </div>
        </div>
        {/* Chat Div */}
        {chat && (
          <Chat
            sendMessage={sendMessageFromChat}
            generalMessages={generalMessages}
            privateMessages={privateMessages}
            unreadGeneralMessages={unreadGeneralMessages}
            unreadPrivateMessages={unreadPrivateMessages}
            onOpenGeneralMessages={onOpenGeneralMessages}
            onOpenPrivateMessages={onOpenPrivateMessages}
          />
        )}
      </div>
    </div>
  );
}
