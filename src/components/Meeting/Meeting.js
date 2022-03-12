import Toolbar from "./Toolbar";
import Video from "./Video";
import React, { useState, useEffect, useCallback } from "react";
import { closeMeetingIfLastPerson, getParticipants } from "../../api/meeting";
import useMeeting from "../../stores/meetingStore";
import useCall from "../../api/useCall";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  const { meetingID } = useMeeting();
  const { id, callFromArray } = useCall(meetingID);
  const [stream, myStream] = useState(null);

  const [camera, setCamera] = useState(false);
  const toggleCamera = () => {
    setCamera(!camera);
  };

  const [microphone, setMicrophone] = useState(false);
  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const refreshParticipants = useCallback(() => {
    if (!id || !meetingID || !myStream) {
      console.warn("Can't refresh participants: ID/MeetingID missing");
      return;
    }
    getParticipants(meetingID)
      .then((unfilteredParticipants) => {
        const participants = unfilteredParticipants?.filter(
          (participant) => participant !== id
        );
        callFromArray(participants, myStream);
      })
      .catch((error) => console.warn(error));
  }, [callFromArray, id, meetingID]);

  useEffect(() => {
    refreshParticipants();
    return () => {
      closeMeetingIfLastPerson();
    };
  }, [refreshParticipants]);

  return (
    <div className={globalStyles}>
      <div className="flex flex-row justify-center items-center h-full bg-stone-400">
        <div>
          <Video camera={camera} microphone={microphone} />
        </div>
        <div className="flex justify-end p-2">
          <Toolbar
            camera={camera}
            toggleCamera={toggleCamera}
            microphone={microphone}
            toggleMicrophone={toggleMicrophone}
          />
        </div>
      </div>
    </div>
  );
}
