import { useEffect, useState } from "react";
import Button from "../../Button";
import Video from "../../Meeting/Video"


export default function SeeMyself() {

const [myStream, setMyStream] = useState(null);
const [camera, setCamera] = useState(false);
const [text, setText] = useState("")

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
        setText("close video")
      })
      .catch(() => {
        if (myStream) stopStream(myStream);
        setMyStream(null);
        setText("open video")
      });
};

  useEffect(() => {
    refreshMedia(camera);
  }, [camera]);


  return (
    <div className="flex flex-row items-center h-full gap-x-2 justify-center">
      <div className="dark:bg-dark-800 h-80 w-72 rounded-3xl p-4 dark:shadow shadow-lg flex flex-col justify-between relative">
        <div className="flex flex-col gap-y-2 h-full">
         <Video stream={myStream} name={"my video"}/>
         <div className="text-center"><p>click the button to see your video</p></div>
         <div className="flex flex-row justify-center items-center gap-x-2 w-full">
            <Button onClick={toggleCamera} text={text} />
          </div>
        </div>
      </div>
    </div>
  );
}
