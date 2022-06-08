import { useEffect, useState } from "react";
import Button from "../../Button";
import Video from "../../Meeting/Video/Video";

export default function SeeMyself() {
  const [myStream, setMyStream] = useState(null);
  const [camera, setCamera] = useState(false);
  const [text, setText] = useState("");

  const toggleCamera = () => {
    setCamera(!camera);
  };

  const stopStream = (streamToStop) => {
    streamToStop.getTracks().forEach((track) => track.stop());
  };

  const refreshMedia = (video, audio) => {
    function getMedia(constraints) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    getMedia({ video, audio })
      .then((stream) => {
        if (myStream) stopStream(myStream);
        setMyStream(stream);
        setText("Close Video");
      })
      .catch(() => {
        if (myStream) stopStream(myStream);
        setMyStream(null);
        setText("Open Video");
      });
  };

  useEffect(() => {
    refreshMedia(camera);
  }, [camera]);

  return (
    <div className="flex flex-row items-center w-full h-full overflow-hidden gap-x-2 justify-center ">
      <div className="dark:bg-dark-800 dark:bg-opacity-50 rounded-3xl p-4 dark:shadow shadow-lg flex flex-col justify-between relative">
        <div className="flex flex-col gap-y-2 w-full h-auto">
          <h2 className="font-medium text-xl border-b-2 mb-1 pb-1">
            Media Preview
          </h2>
          <div className="h-full w-auto">
            <Video stream={myStream} name={"My Video"} />
          </div>

          <div className="flex flex-row justify-center items-center gap-x-2 w-full">
            <Button onClick={toggleCamera} text={text} />
          </div>
        </div>
      </div>
    </div>
  );
}
