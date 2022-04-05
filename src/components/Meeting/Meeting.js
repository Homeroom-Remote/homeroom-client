import { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";

import useMeeting from "../../stores/meetingStore";
import useUser from "../../stores/userStore";
import useRoom from "../../api/useColyseus";
import usePeer from "../../api/usePeer";
import { getToken } from "../../api/auth";

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
  // Internal hooks
  const [chat, setChat] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [camera, setCamera] = useState(false);
  const [generalMessages, setGeneralMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [unreadGeneralMessages, setUnreadGeneralMessages] = useState(0);
  const [unreadPrivateMessages, setUnreadPrivateMessages] = useState(0);

  // External hooks
  const { meetingID } = useMeeting();
  const { user } = useUser();
  const { isOnline, error, registerMessages, sendChatMessage } =
    useRoom(meetingID);
  const { createPeer, signalPeer, destroyPeer, myStream } = usePeer({
    video: camera,
    audio: microphone,
  });

  const toggleCamera = () => {
    setCamera(!camera);
  };

  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const toggleChat = () => {
    setChat(!chat);
  };

  useEffect(() => {}, []);

  ///////////////////////////////////////////////////////////////////////////////////

  // const myArray = [
  //   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  //   21,
  // ];
  // const streamArray = [
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  //   myStream,
  // ];
  // const numOfVideosInPage = 8;

  // const [startIndex, setStartIndex] = useState(0);
  // const toggleForward = () => {
  //   if (startIndex + numOfVideosInPage < streamArray.length - 1) {
  //     setStartIndex(Math.min(startIndex + numOfVideosInPage));
  //     setEndIndex(
  //       Math.min(endIndex + numOfVideosInPage, streamArray.length - 1)
  //     );
  //   }
  // };

  // const [endIndex, setEndIndex] = useState(
  //   Math.min(numOfVideosInPage - 1, streamArray.length - 1)
  // );
  // const toggleBackward = () => {
  //   if (startIndex >= numOfVideosInPage) {
  //     setEndIndex(Math.min(startIndex - 1, streamArray.length - 1));
  //     setStartIndex(startIndex - numOfVideosInPage);
  //   }
  // };

  ///////////////////////////////////////////////////////////////////////////////////

  const sendMessageFromChat = (message) => {
    sendChatMessage(message);
  };

  const addGeneralMessage = (messageObject) => {
    setGeneralMessages((oldMessages) => [...oldMessages, messageObject]);
  };

  const onOpenGeneralMessages = () => setUnreadGeneralMessages(0);
  const onOpenPrivateMessages = () => setUnreadPrivateMessages(0);

  if (error) {
    return <Error error={error} />;
  }

  if (!isOnline) {
    return <RoomLoading />;
  }

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
          {/* <VideoWrapper
            startIndex={startIndex}
            endIndex={endIndex}
            toggleForward={toggleForward}
            toggleBackward={toggleBackward}
            chat={chat}
            myStream={myStream}
            mainSpeaker={myStream}
            otherParticipants={streamArray}
            myArray={myArray}
          /> */}

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
