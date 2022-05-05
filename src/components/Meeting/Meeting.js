import { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";
import Participants from "./Participants"
import Error from "./Error";

import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
import useChat from "../../stores/chatStore";
import useRoom from "../../api/useColyseus";
import usePeer from "../../api/usePeer";
import MeetingLoading from "./MeetingLoading";
import Handsfree from "handsfree"



const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  const { defaultVideo, defaultAudio } = useVideoSettings();
  const [myStream, setMyStream] = useState(null);
  const [chat, setChat] = useState(false);
  const [microphone, setMicrophone] = useState(defaultAudio);
  const [camera, setCamera] = useState(defaultVideo);
  const [participants, setParticipants] = useState(false);

  const { meetingID, exitMeeting } = useMeeting();
  const { isOnline, error, registerMessages, sendChatMessage } =
    useRoom(meetingID);
  const { createPeer, destroyPeer, peers } = usePeer(myStream);
  const { addGeneralMessage } = useChat();

  const [MyHandsfree, setMyHandsfree] = useState(null)


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
    return () => myStream && stopStream(myStream);
  }, []);

  useEffect(() => {
    const mediaStreamTracks = myStream?.getVideoTracks();
    if (!mediaStreamTracks || mediaStreamTracks.length <= 0) { // if not video
      return;
    }
    if (!MyHandsfree && document.querySelector("#myVideoEl")) {

      const handsfree = new Handsfree({
        showDebug: false,
        hands: true,
        setup: {
          video: {
            // This element must contain a [src=""] attribute or <source /> with one
            $el: document.querySelector("#myVideoEl")
          }
        }
      })
      // handsfree.enablePlugins('browser')
      handsfree.start()
      const u_thumbs_up = handsfree.useGesture({
        "name": "u_thumbs_up",
        "algorithm": "fingerpose",
        "models": "hands",
        "confidence": "8.61",
        "description": [
          [
            "addCurl",
            "Thumb",
            "NoCurl",
            1
          ],
          [
            "addDirection",
            "Thumb",
            "DiagonalUpRight",
            1
          ],
          [
            "addDirection",
            "Thumb",
            "VerticalUp",
            0.625
          ],
          [
            "addDirection",
            "Thumb",
            "DiagonalUpLeft",
            0.25
          ],
          [
            "addCurl",
            "Index",
            "FullCurl",
            1
          ],
          [
            "addDirection",
            "Index",
            "HorizontalRight",
            0.3333333333333333
          ],
          [
            "addDirection",
            "Index",
            "DiagonalUpRight",
            1
          ],
          [
            "addDirection",
            "Index",
            "VerticalUp",
            0.1111111111111111
          ],
          [
            "addDirection",
            "Index",
            "DiagonalUpLeft",
            0.2222222222222222
          ],
          [
            "addCurl",
            "Middle",
            "FullCurl",
            1
          ],
          [
            "addCurl",
            "Middle",
            "HalfCurl",
            0.034482758620689655
          ],
          [
            "addDirection",
            "Middle",
            "HorizontalRight",
            1
          ],
          [
            "addDirection",
            "Middle",
            "DiagonalUpRight",
            0.2631578947368421
          ],
          [
            "addDirection",
            "Middle",
            "DiagonalUpLeft",
            0.3157894736842105
          ],
          [
            "addCurl",
            "Ring",
            "FullCurl",
            1
          ],
          [
            "addCurl",
            "Ring",
            "NoCurl",
            0.034482758620689655
          ],
          [
            "addDirection",
            "Ring",
            "HorizontalRight",
            1
          ],
          [
            "addDirection",
            "Ring",
            "DiagonalUpRight",
            0.043478260869565216
          ],
          [
            "addDirection",
            "Ring",
            "HorizontalLeft",
            0.08695652173913043
          ],
          [
            "addDirection",
            "Ring",
            "DiagonalUpLeft",
            0.17391304347826086
          ],
          [
            "addCurl",
            "Pinky",
            "FullCurl",
            1
          ],
          [
            "addCurl",
            "Pinky",
            "HalfCurl",
            0.034482758620689655
          ],
          [
            "addDirection",
            "Pinky",
            "HorizontalRight",
            1
          ],
          [
            "addDirection",
            "Pinky",
            "HorizontalLeft",
            0.3333333333333333
          ],
          [
            "addDirection",
            "Pinky",
            "DiagonalDownRight",
            0.047619047619047616
          ],
          [
            "addDirection",
            "Pinky",
            "DiagonalDownLeft",
            0.047619047619047616
          ]
        ]
      })
      // u_thumbs_down = handsfree.useGesture({
      //   "name": "u_thumbs_down",
      //   "algorithm": "fingerpose",
      //   "models": "hands",
      //   "confidence": "8.5",
      //   "description": [
      //     [
      //       "addCurl",
      //       "Thumb",
      //       "NoCurl",
      //       1
      //     ],
      //     [
      //       "addDirection",
      //       "Thumb",
      //       "DiagonalDownRight",
      //       1
      //     ],
      //     [
      //       "addDirection",
      //       "Thumb",
      //       "VerticalDown",
      //       0.6875
      //     ],
      //     [
      //       "addCurl",
      //       "Index",
      //       "FullCurl",
      //       1
      //     ],
      //     [
      //       "addCurl",
      //       "Index",
      //       "NoCurl",
      //       0.2631578947368421
      //     ],
      //     [
      //       "addCurl",
      //       "Index",
      //       "HalfCurl",
      //       0.15789473684210525
      //     ],
      //     [
      //       "addDirection",
      //       "Index",
      //       "DiagonalDownRight",
      //       1
      //     ],
      //     [
      //       "addDirection",
      //       "Index",
      //       "HorizontalRight",
      //       0.3
      //     ],
      //     [
      //       "addDirection",
      //       "Index",
      //       "VerticalDown",
      //       0.9
      //     ],
      //     [
      //       "addDirection",
      //       "Index",
      //       "DiagonalDownLeft",
      //       0.4
      //     ],
      //     [
      //       "addDirection",
      //       "Index",
      //       "HorizontalLeft",
      //       0.1
      //     ],
      //     [
      //       "addCurl",
      //       "Middle",
      //       "FullCurl",
      //       1
      //     ],
      //     [
      //       "addCurl",
      //       "Middle",
      //       "HalfCurl",
      //       0.18181818181818182
      //     ],
      //     [
      //       "addCurl",
      //       "Middle",
      //       "NoCurl",
      //       0.045454545454545456
      //     ],
      //     [
      //       "addDirection",
      //       "Middle",
      //       "HorizontalRight",
      //       1
      //     ],
      //     [
      //       "addDirection",
      //       "Middle",
      //       "DiagonalDownRight",
      //       0.14285714285714285
      //     ],
      //     [
      //       "addDirection",
      //       "Middle",
      //       "DiagonalDownLeft",
      //       0.35714285714285715
      //     ],
      //     [
      //       "addDirection",
      //       "Middle",
      //       "VerticalDown",
      //       0.07142857142857142
      //     ],
      //     [
      //       "addDirection",
      //       "Middle",
      //       "HorizontalLeft",
      //       0.35714285714285715
      //     ],
      //     [
      //       "addCurl",
      //       "Ring",
      //       "FullCurl",
      //       1
      //     ],
      //     [
      //       "addCurl",
      //       "Ring",
      //       "HalfCurl",
      //       0.08
      //     ],
      //     [
      //       "addDirection",
      //       "Ring",
      //       "HorizontalRight",
      //       1
      //     ],
      //     [
      //       "addDirection",
      //       "Ring",
      //       "HorizontalLeft",
      //       0.5714285714285714
      //     ],
      //     [
      //       "addDirection",
      //       "Ring",
      //       "DiagonalUpRight",
      //       0.07142857142857142
      //     ],
      //     [
      //       "addDirection",
      //       "Ring",
      //       "VerticalDown",
      //       0.07142857142857142
      //     ],
      //     [
      //       "addDirection",
      //       "Ring",
      //       "DiagonalDownLeft",
      //       0.21428571428571427
      //     ],
      //     [
      //       "addCurl",
      //       "Pinky",
      //       "FullCurl",
      //       1
      //     ],
      //     [
      //       "addCurl",
      //       "Pinky",
      //       "HalfCurl",
      //       0.038461538461538464
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "HorizontalRight",
      //       1
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "DiagonalUpRight",
      //       0.18181818181818182
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "VerticalUp",
      //       0.2727272727272727
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "DiagonalUpLeft",
      //       0.09090909090909091
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "DiagonalDownRight",
      //       0.09090909090909091
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "DiagonalDownLeft",
      //       0.18181818181818182
      //     ],
      //     [
      //       "addDirection",
      //       "Pinky",
      //       "HorizontalLeft",
      //       0.6363636363636364
      //     ]
      //   ]
      // })
      handsfree.use("logger", (data) => {
        // console.log(data.hands.gesture)
        const tunmbs_up = data?.hands?.gesture?.find((event) => {
          return event?.name === "u_thumbs_up"
        })
        // const tunmbs_down = data?.hands?.gesture?.find((event) => {
        //   return event?.name === "u_thumbs_down"
        // })
        if (tunmbs_up) {
          console.log("tunmbs_up")
          console.log(tunmbs_up)
        }
        // if (tunmbs_down) {
        //   console.log("thumbs_down")
        //   console.log(tunmbs_down)
        // }
      })
      handsfree.on("u_thumbs_up", (event) => {
        console.log(event.detail)
      })
      // handsfree.on("u_thumbs_down", (event) => {
      //   console.log(event.detail)
      // })
      console.log("DEBUG")
      console.log(handsfree.debug)
      setMyHandsfree(handsfree.canvas)
    }


  }, [myStream])

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

  const toggleParticipants = () => {
    setParticipants(!participants);
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
            ((participants || chat) ? "col-span-7" : "col-span-10")
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
              participants={participants}
              toggleParticipants={toggleParticipants}
            />
          </div>
        </div>
        {/* Chat Div */}
        <div className="flex flex-col bg-red-500 w-full h-full col-span-3 divide-y-2 divide-opacity-50">
          {chat && <Chat sendMessage={sendMessageFromChat} isParticipantsOpen={participants} />}
          {participants && <Participants peers={peers} cameraState={camera} microphoneState={microphone} isChatOpen={chat} />}
        </div>
      </div>
    </div>
  );
}
