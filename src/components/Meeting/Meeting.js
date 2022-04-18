import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";
import Error from "./Error";
import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
import useChat from "../../stores/chatStore";
import useRoom from "../../api/useColyseus";
import usePeer from "../../api/usePeer";
import MeetingLoading from "./MeetingLoading";
// import usePython from "../PythonShell";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

// const pyshell_module = require("python-shell");
// const pyshell = new pyshell_module.PythonShell("./hand_gestures/main.py", {
//   mode: "text",
// });

// pyshell.on("message", (message) => {
//   document.getElementById("prediction").innerText = message;
//   console.log(message);
// });
// function sendScreenshotURI(uri) {
//   try {
//     pyshell.send(uri);
//   }
//   catch {
//     console.log("ERROR: sendScreenshotURI")
//   }
// }
// pyshell.on("message", (message) => {
//   document.getElementById("prediction").innerText = message;
//   console.log(message);
// });
// pyshell.on("error", (error) => {
//   console.log(error, "<-------- error");
// });
// pyshell.on("stderr", (error) => {
//   console.log(error, "<-------- error");
// });
// pyshell.on("pythonError", (error) => {
//   console.log(error, "<-------- error");
// });


export default function Meeting() {
  const { defaultVideo, defaultAudio } = useVideoSettings();
  const [myStream, setMyStream] = useState(null);
  const [chat, setChat] = useState(false);
  const [microphone, setMicrophone] = useState(defaultAudio);
  const [camera, setCamera] = useState(defaultVideo);
  const [pythonHandGestureInterval, setPythonHandGestureInterval] = useState(null);

  const { meetingID, exitMeeting } = useMeeting();
  const { isOnline, error, registerMessages, sendChatMessage } =
    useRoom(meetingID);
  const { createPeer, destroyPeer, peers } = usePeer(myStream);
  const { addGeneralMessage } = useChat();
  ////////////////////////////////////////////
  const [PyShell, setPyShell] = useState(null)

  // const { sendScreenshotURI } = usePython();
  // const [pythonShell, setPythonShell] = useState(null);
  ////////////////////////////////////////////
  const toggleCamera = () => {
    setCamera(!camera);
  };

  const toggleMicrophone = () => {
    setMicrophone(!microphone);
  };

  const stopStream = (streamToStop) => {
    streamToStop.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    const pyshell_module = window.require("python-shell")
    if (!PyShell) {
      const pyShellTemp = new pyshell_module.PythonShell("./src/python/hand_gestures/main.py", {
        mode: "text",
        pythonOptions: ["-u"]
      })

      console.log("pyshell temp ", pyShellTemp)

      pyShellTemp.on("message", (message) => {
        console.log(message);
      });

      pyShellTemp.on("error", (error) => {
        console.log(error, "<-------- error");
      });
      pyShellTemp.on("stderr", (error) => {
        console.log(error, "<-------- error");
      });
      pyShellTemp.on("pythonError", (error) => {
        console.log(error, "<-------- error");
      });


      setPyShell(pyShellTemp)
    }

    return () => myStream && stopStream(myStream);
  }, []);

  useEffect(() => { // when stream is changed
    // console.log("MY STREAM :::::::")
    // console.log(myStream)
    const mediaStreamTracks = myStream?.getVideoTracks();
    console.log("MY mediaStreamTracks :::::::")
    console.log(mediaStreamTracks)
    if (!mediaStreamTracks || mediaStreamTracks.length <= 0) { // if not video
      if (pythonHandGestureInterval) {
        clearInterval(pythonHandGestureInterval)
      }
      return;
    }
    if (pythonHandGestureInterval) { // already have Interval so do nothing
      return;
    }

    setPythonHandGestureInterval(setInterval(() => {

      const image_capture = new ImageCapture(mediaStreamTracks[0])
      image_capture.takePhoto().then((blob) => {
        const a = new FileReader();
        a.onload = function (e) { sendPic(e.target.result); }
        a.readAsDataURL(blob);
      })

      function sendPic(dataUrl) {
        if (PyShell) {
          console.log("send URL")

          PyShell.send(dataUrl)
        }
      }

    }, 1000))

  }, [myStream])

  // create Intarvel every 1000 send screen shot
  const refreshMedia = (video, audio) => {

    function getMedia(constraints) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    getMedia({ video, audio })
      .then((stream) => {
        if (myStream) stopStream(myStream);
        setMyStream(stream);
      })
      .catch(() => {
        if (myStream) stopStream(myStream);
        setMyStream(null);
      });
  };

  useEffect(() => {
    refreshMedia(camera, microphone);
  }, [camera, microphone]);

  const toggleChat = () => {
    setChat(!chat);
  };

  const sendMessageFromChat = (message) => {
    sendChatMessage(message);
  };

  if (error) {
    return <Error error={error} goBack={exitMeeting} />;
  }
  if (!isOnline) {
    return <MeetingLoading />;
  }

  // socket room messages
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
          <VideoWrapper myStream={myStream} otherParticipants={peers} />
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
        {chat && <Chat sendMessage={sendMessageFromChat} chat={chat} />}
      </div>
    </div>
  );
}
