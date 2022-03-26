import Toolbar from "./Toolbar";
import Video from "./Video";
import Chat from "./Chat";
import React, { useState, useEffect } from "react";
import useMeeting from "../../stores/meetingStore";
import useUser from "../../stores/userStore";
import useCall from "../../api/useCall";
import mediaSource from "../../api/mediaSource";
import Wrapper from "./Wrapper";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen max-w-screen min-h-max w-screen overflow-y-hidden";

export default function Meeting() {
  const { meetingID } = useMeeting();
  const { user } = useUser();
  const { peers, setMyStream, myStream, onMediaStreamChange } = useCall(
    meetingID,
    user.uid
  );

  const [media, setMedia] = useState(null);
  const [chat, setChat] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [camera, setCamera] = useState(false);

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

  const refreshMedia = (shouldUseVideo, shouldUseAudio) => {
    if (!shouldUseAudio && !shouldUseVideo) {
      media.removeAudio();
      media.removeVideo();
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
          <div className="row-span-9 dark:bg-dark-700 bg-lt-400">
            {/* My Video */}
            <Video mediaStream={myStream} />

            {/* Participants Videos */}
            {Object.keys(peers).map((call, idx) => (
              <Video mediaStream={peers[call]?.stream} key={`peer-${idx}`} />
            ))}
          </div>
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
        {chat && <Chat />}
      </div>
    </div>
  );
}
