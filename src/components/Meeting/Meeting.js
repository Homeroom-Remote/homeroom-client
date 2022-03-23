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
                      transition-colors max-h-screen h-screen max-w-screen w-screen overflow-y-hidden";

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
      <div className="h-full dark:bg-dark-800 bg-lt-600 grid grid-flow-col grid-cols-8 divide-x dark:divide-dark-600 divide-lt-600">
        {/* Video & Toolbar Div */}
        <div
          className={
            "h-full grid grid-rows-10 grid-flow-row grid-rows " +
            (chat ? "col-span-6" : "col-span-8")
          }
        >
          <div className="dark:bg-dark-700 bg-lt-400 row-span-9">
            {/* My Video */}
            <Video mediaStream={myStream} />

            {/* Participants Videos */}
            {Object.keys(peers).map((callID, idx) => (
              <Video mediaStream={peers[callID]} key={`peer-${idx}`} />
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
