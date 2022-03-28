import Toolbar from "./Toolbar";
import Video from "./Video";
import Chat from "./Chat";
import React, { useState, useEffect } from "react";
import useMeeting from "../../stores/meetingStore";
import useUser from "../../stores/userStore";
import useCall from "../../api/useCall";
import mediaSource from "../../api/mediaSource";
import VideoWrapper from "./VideoWrapper";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen max-w-screen min-h-max w-screen overflow-y-hidden";

export default function Meeting() {
  const { meetingID } = useMeeting();
  const { user } = useUser();
  const {
    peers,
    setMyStream,
    myStream,
    onMediaStreamChange,
    sendMessage,
    messageListener,
  } = useCall(meetingID, user.uid);

  const [media, setMedia] = useState(null);
  const [chat, setChat] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [camera, setCamera] = useState(false);
  const [generalMessages, setGeneralMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [unreadGeneralMessages, setUnreadGeneralMessages] = useState(0);
  const [unreadPrivateMessages, setUnreadPrivateMessages] = useState(0);

  // messageListener === new socket message
  useEffect(() => {
    if (messageListener) {
      setGeneralMessages((formerGeneralMessages) => [
        ...formerGeneralMessages,
        { ...messageListener, isMe: user.sender === messageListener.uid },
      ]);
    }
    setUnreadGeneralMessages((unread) => unread + 1);
  }, [messageListener]);

  const toggleCamera = () => {
    refreshMedia(!camera, microphone);
    setCamera(!camera);
  };

  const toggleMicrophone = () => {
    refreshMedia(camera, !microphone);
    setMicrophone(!microphone);
  };

  const toggleChat = () => {
    setChat(!chat);
  };



///////////////////////////////////////////////////////////////////////////////////


const myArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
const streamArray = [myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream, myStream]
const numOfVideosInPage = 8

const [startIndex, setStartIndex] = useState(0);
const toggleForward = () => {
  if(startIndex + numOfVideosInPage < streamArray.length - 1) {
    setStartIndex(Math.min(startIndex+numOfVideosInPage))
    setEndIndex(Math.min(endIndex+numOfVideosInPage, streamArray.length-1))
  }
};

const [endIndex, setEndIndex] = useState(Math.min(numOfVideosInPage-1, streamArray.length-1));
const toggleBackward = () => {
  if(startIndex >= numOfVideosInPage) {
    setEndIndex(Math.min(startIndex-1, streamArray.length-1))
    setStartIndex(startIndex-numOfVideosInPage)
  }
};

///////////////////////////////////////////////////////////////////////////////////




  const sendMessageFromChat = (message) => {
    if (!message || message.length > 200 || message.length <= 0) {
      console.warn("Message has to be a string between 0 & 200 chars");
      return;
    }

    sendMessage(message);
  };

  const onOpenGeneralMessages = () => setUnreadGeneralMessages(0);
  const onOpenPrivateMessages = () => setUnreadPrivateMessages(0);

  const refreshMedia = (shouldUseVideo, shouldUseAudio) => {
    if (!shouldUseAudio && !shouldUseVideo) {
      media.initWithEmptyStream();
      setMyStream(media.getSource());
      onMediaStreamChange();
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: shouldUseVideo, audio: shouldUseAudio })
      .then((stream) => {
        media.addAudioFromStream(stream);
        media.addVideoFromStream(stream);
        setMyStream(media.getSource());
        onMediaStreamChange();
      });
  };

  useEffect(() => {
    const media = new mediaSource();
    setMedia(media);
    setMyStream(media.getSource());
  }, [setMyStream]);

  useEffect(() => {
    console.log("peers changed", peers);
  }, [peers]);

  return (
    <div className={globalStyles}>
      <div className="h-full grid grid-flow-col grid-cols-10 grid-rows-1">
        <div
          className={
            "grid grid-rows-10 grid-flow-row bg-red-200 h-full " +
            (chat ? "col-span-7" : "col-span-10")
          }
        >
          <VideoWrapper startIndex={startIndex} endIndex={endIndex} toggleForward={toggleForward} toggleBackward={toggleBackward} chat={chat} myStream={myStream} mainSpeaker={myStream} otherParticipants={streamArray} myArray={myArray} />

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
