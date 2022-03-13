import Toolbar from "./Toolbar";
import Video from "./Video";
import React, { useState, useEffect, useCallback } from "react";
import { getParticipants } from "../../api/meeting";
import useMeeting from "../../stores/meetingStore";
import useUser from "../../stores/userStore";
import useCall from "../../api/useCall";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  const { meetingID } = useMeeting();
  const { user } = useUser();
  const { id, callFromArray, peers } = useCall(user.uid);
  const [myMediaStream, setMyMediaStream] = useState(null);

  const [camera, setCamera] = useState(false);
  const toggleCamera = () => {
    setCamera(!camera);
  };

  const [microphone, setMicrophone] = useState(false);
  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const refreshParticipants = useCallback(() => {
    if (!id || !meetingID) {
      console.warn("Can't refresh participants: ID/MeetingID missing");
      return;
    }
    const myID = user.uid;
    getParticipants(meetingID)
      .then((unfilteredParticipants) => {
        const participants = unfilteredParticipants?.filter(
          (participant) => participant !== myID
        );
        callFromArray(participants, myMediaStream);
      })
      .catch((error) => console.warn(error));
  }, [id, meetingID, myMediaStream, user.uid]);

  const getMyStream = useCallback(() => {
    if (microphone || camera) {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      getUserMedia({ video: camera, audio: microphone }, (mediaStream) => {
        setMyMediaStream(mediaStream);
      });
    } else {
      setMyMediaStream(null);
    }
  }, [camera, microphone]);

  useEffect(() => {
    console.log("my peers changed", peers);
  }, [peers]);

  useEffect(() => {
    refreshParticipants();
  }, [refreshParticipants]);

  useEffect(() => {
    getMyStream();
  }, [getMyStream]);

  return (
    <div className={globalStyles}>
      <div className="grid grid-flow-col grid-cols-8 h-full bg-stone-400">
        {/* Video & Toolbar Div */}
        <div
          className={"flex flex-col " + (false ? "col-span-6" : "col-span-8")}
        >
          {/* Video Div */}
          <div className="h-full w-full">
            {/* My Video */}
            <Video mediaStream={myMediaStream} />

            {/* Participants Videos */}
            {peers.map((peer, idx) => (
              <Video
                mediaStream={peer.stream}
                key={`peer-${peer.peer}-${idx}`}
              />
            ))}
          </div>

          {/* Toolbar */}
          <Toolbar
            camera={camera}
            toggleCamera={toggleCamera}
            microphone={microphone}
            toggleMicrophone={toggleMicrophone}
          />
        </div>
        {false && (
          <div className="flex justify-end p-2 bg-lt-100 col-span-2">
            <div className="w-1/2"></div>
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
