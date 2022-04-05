import { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";

import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
import useRoom from "../../api/useColyseus";
import usePeer from "../../api/usePeer";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen max-w-screen min-h-max w-screen overflow-y-hidden";

function RoomLoading() {
  return <div className={globalStyles}>Loading meeting</div>;
}

function Error({ error }) {
  return <div className={globalStyles}>Error</div>;
}
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

  const { meetingID } = useMeeting();
  const { isOnline, error, registerMessages, sendChatMessage } =
    useRoom(meetingID);
  const { createPeer, destroyPeer, peers } = usePeer(myStream);

  const toggleCamera = () => {
    setCamera(!camera);
  };

  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const refreshMedia = (video, audio) => {
    function getMedia(constraints) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    getMedia({ video, audio })
      .then((stream) => setMyStream(stream))
      .catch(() => {
        if (myStream) {
          myStream.getTracks().forEach((track) => track.stop());
        }
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

  // TODO: graphic of error and a return button
  if (error) {
    return <Error error={error} />;
  }

  // TODO: graphic of room loading
  if (!isOnline) {
    return <RoomLoading />;
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
          <VideoWrapper
            chat={chat}
            myStream={myStream}
            otherParticipants={peers}
          />

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
