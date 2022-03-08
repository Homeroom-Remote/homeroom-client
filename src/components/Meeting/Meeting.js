import Toolbar from "./Toolbar";
import Video from "./Video";
import React, { useState, useEffect } from "react";
import { closeMeetingIfLastPerson } from "../../api/meeting";
const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  const [camera, setCamera] = useState(false);
  const toggleCamera = () => {
    setCamera(!camera);
  };

  const [microphone, setMicrophone] = useState(false);
  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  useEffect(() => {
    return () => {
      closeMeetingIfLastPerson();
    };
  }, []);

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
