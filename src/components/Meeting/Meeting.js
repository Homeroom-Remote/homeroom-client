import Toolbar from "./Toolbar";
import Video from "./Video";
import Chat from "./Chat";
import React, { useState, useEffect } from "react";
import useMeeting from "../../stores/meetingStore";
import useUser from "../../stores/userStore";
import useCall from "../../api/useCall";
import Wrapper from "./Wrapper";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  const { meetingID } = useMeeting();
  const { user } = useUser();
  const { peers, setMyStream, myStream } = useCall(meetingID, user.uid);

  const [camera, setCamera] = useState(true);
  const toggleCamera = () => {
    setCamera(!camera);
  };

  const [microphone, setMicrophone] = useState(true);
  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const [chat, setChat] = useState(false);
  const toggleChat = () => {
    setChat(!chat);
  };

  useEffect(() => {
    async function setMedia() {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: camera,
          audio: microphone,
        });
      } catch (err) {
        console.log(err);
        console.warn("Error on Meeting.js: getUserMedia");
      }

      setMyStream(stream);
    }

    setMedia();
  }, [camera, microphone, setMyStream]);

  useEffect(() => {
    console.log(peers);
  }, [peers]);

  return (
    <div className={globalStyles}>
      <div className="grid grid-flow-col grid-cols-8 h-full bg-stone-400">
        {/* Video & Toolbar Div */}
        <div
          className={"flex flex-col " + (chat ? "col-span-6" : "col-span-8")}
        >
          {/* Video Div */}
          {/* <Wrapper myStream={} mainSpeaker={} otherParticipants={[]} /> */}
          <div className="h-full w-full grid grid-flow-row grid-cols-3 gap-x-1">
            {/* My Video */}
            <Video mediaStream={myStream} />

            {/* Participants Videos */}
            {Object.keys(peers).map((callID, idx) => (
              <Video mediaStream={peers[callID]} key={`peer-${idx}`} />
            ))}
          </div>

          {/* Toolbar */}
          <Toolbar
            camera={camera}
            toggleCamera={toggleCamera}
            microphone={microphone}
            toggleMicrophone={toggleMicrophone}
            chat={chat}
            toggleChat={toggleChat}
          />
        </div>
        {chat && (
          <div className="flex flex-col items-center bg-lt-100 col-span-2">
            <Chat chat={chat} />
          </div>
        )}
        {/* Chat Div */}
      </div>
    </div>
  );
}

<div>
  <div className="relative grid-cols-full">
    <Video />
    <Toolbar />
  </div>
</div>;
