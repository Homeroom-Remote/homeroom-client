import { useEffect, useState, useRef } from "react";

/////////////
// Components
/////////////
import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";
import Participants from "./Participants";
import Error from "./Error";
import MeetingLoading from "./MeetingLoading";
import Timer from "../Home/Settings/Timer";
import QuestionQueue from "./QuestionQueue";
import ExpressionsChart from "./ExpressionsChart";
import ConcentrationMeter from "./ConcentrationMeter";
import Swal from "sweetalert2";

//////
// API
//////
import Peer from "../../api/usePeer";
import { getToken } from "../../api/auth";
import {
  CreateRoom,
  JoinRoom,
  LeaveRoom,
  RegisterMessages,
  SendChatMessage,
  SendHandGesture,
  SendConcentrationPrediction,
  SendExpressionsPrediction,
  RegisterToMessageQueue,
  RemoveFromMessageQueue,
  GetOwner,
  GetQuestionQueue,
} from "../../api/room";
import HandGestures from "./MachineLearningModules/HandGestures";

////////////////
// State & Store
////////////////
import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
import useUser from "../../stores/userStore";
import usePopup from "../../stores/popupStore";
import useSettings from "../../stores/settingsStore";

////////
// Utils
////////
import handGestureList from "../../utils/handGestureList";
import FaceRecognition from "./MachineLearningModules/FaceRecognition";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-100 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";

export default function Meeting() {
  // Media hooks
  const { defaultVideo, defaultAudio } = useVideoSettings();
  const [microphone, setMicrophone] = useState(defaultAudio);
  const [camera, setCamera] = useState(defaultVideo);
  const [myStream, setMyStream] = useState(null);
  const { askBeforeVideo, askBeforeAudio, showConnectionTime } = useSettings();

  // Loading/Error hooks
  const [error, setError] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [machineLearningReady, setMachineLearningReady] = useState(false);

  // Child component hooks
  const [chat, setChat] = useState(false);
  const [participants, setParticipants] = useState(false);
  let generalChatSetter = null;

  // Room hooks
  const [room, setRoom] = useState(null);
  const { meetingID, exitMeeting, setOwner } = useMeeting();
  const [peers, setPeers] = useState([]);

  // etc
  const { user } = useUser();
  const { setShow, setOpts } = usePopup();

  // Hand recognition
  const handIntervalTime = 1000; // Every 1s
  var detectionInterval = useRef(null);
  const handGestures = useRef(new Map());

  ////////////////
  // Concentration
  ////////////////
  const concentrationAlpha = 0.6;
  const [showConcentrationMeter, setShowConcentrationMeter] = useState(false);
  let concentrationSetter = null;
  const onConcentrationMeterMount = (data) => {
    concentrationSetter = data[1];
    refreshRoomCallbacks(room);
  };
  const toggleConcentrationMeter = () =>
    setShowConcentrationMeter((val) => !val);

  //////////////
  // Expressions
  //////////////
  const expressionAlpha = 0.4; // How much of the new expression object affects the expression state
  const [showExpressionsChart, setShowExpressionsChart] = useState(false);
  let expressionsSetter = null;
  const onExpressionsChartMount = (data) => {
    expressionsSetter = data[1];
    refreshRoomCallbacks(room);
  };
  const toggleExpressionsChart = () => setShowExpressionsChart((val) => !val);

  /////////////////
  // Question Queue
  /////////////////
  const [questionQueue, setQuestionQueue] = useState([]);
  const [showQuestionQueue, setShowQuestionQueue] = useState(false);
  const toggleQuestionQueue = () => setShowQuestionQueue((val) => !val);
  const removeQuestionByID = (id) => RemoveFromMessageQueue(room, id);

  const addQuestion = (id, displayName) => {
    setQuestionQueue((oldQueue) => {
      const exists = oldQueue.find((qo) => qo.id === id);
      if (exists) return oldQueue;
      else return oldQueue.concat({ id: id, displayName: displayName });
    });
  };

  ////////
  // Media
  ////////
  const toggleCamera = () => {
    if (camera) setCamera(!camera);
    else if (askBeforeVideo) {
      Swal.fire({
        // width: "20%",
        title: "Are you sure you want to turn on the camera?",
        color: "rgb(74, 222, 128)",
        background: "rgb(126, 34, 206)",
        showCancelButton: true,
        confirmButtonColor: "rgb(34, 197, 94)",
        confirmButtonText: "Yes, turn on my camera",
        // cancelButtonColor: "rgb(168, 85, 247)",
        cancelButtonText: "Cancel",
        icon: "question",
        // backdrop: 'rgba(0,0,123,0.4)'
      }).then((result) => {
        if (result.isConfirmed) {
          setCamera(!camera);
        }
      });
    } else setCamera(!camera);
  };

  const toggleMicrophone = () => {
    if (microphone) setMicrophone(!microphone);
    else if (askBeforeAudio) {
      Swal.fire({
        // width: "20%",
        title: "Are you sure you want to turn on the microphone?",
        color: "rgb(74, 222, 128)",
        background: "rgb(126, 34, 206)",
        showCancelButton: true,
        confirmButtonColor: "rgb(34, 197, 94)",
        confirmButtonText: "Yes, turn on my microphone",
        // cancelButtonColor: "rgb(168, 85, 247)",
        cancelButtonText: "Cancel",
        icon: "question",
        // backdrop: 'rgba(0,0,123,0.4)'
      }).then((result) => {
        if (result.isConfirmed) {
          setMicrophone(!microphone);
        }
      });
    } else setMicrophone(!microphone);
  };

  const stopStream = (streamToStop) => {
    streamToStop.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    return () => myStream && stopStream(myStream);
  }, []);

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

  ///////
  // Chat
  ///////
  const toggleChat = () => {
    setChat(!chat);
  };

  const toggleParticipants = () => {
    setParticipants(!participants);
  };

  const sendMessageFromChat = (message) => {
    SendChatMessage(room, message);
  };

  const onChatMount = (dataFromChat) => {
    generalChatSetter = dataFromChat[1];
    refreshRoomCallbacks(room);
  };

  ///////
  // Room
  ///////
  function refreshRoomCallbacks(room) {
    if (!room) return;
    RegisterMessages(room, [
      {
        name: "join",
        callback: (room, message) => onPeerJoin(room, message),
      },
      {
        name: "leave",
        callback: (room, message) => onPeerLeave(room, message),
      },
      {
        name: "signal",
        callback: (room, message) => onPeerSignal(room, message),
      },
      {
        name: "chat-message",
        callback: (room, message) => onGeneralMessage(message),
      },
      {
        name: "hand-gesture",
        callback: (room, message) => onHandRecognition(message),
      },
      {
        name: "get-owner",
        callback: (room, message) => onGetOwner(message),
      },
      {
        name: "get-question-queue",
        callback: (room, message) => onQuestionQueue(message),
      },
      {
        name: "question-queue-status", // personal (if succeded/failed to add/remove from queue)
        callback: (room, message) => onQuestionQueueStatus(message),
      },
      {
        name: "question-queue-update", // broadcasted (if someone was added/removed)
        callback: (room, message) => onQuestionQueueUpdate(room, message),
      },
      {
        name: "face-recognition", // broadcasted (statistics)
        callback: (room, message) => onFaceRecognition(message),
      },
    ]);
  }

  ///////////////////////////
  // Socket messages handlers
  ///////////////////////////

  function onFaceRecognition(message) {
    function handleExpressions(newExpressions) {
      expressionsSetter((oldExpressions) => {
        return Object.keys(oldExpressions).length === 0
          ? newExpressions
          : Object.entries(oldExpressions).reduce(
              (prev, [k, v]) => ({
                ...prev,
                [k]:
                  (1 - expressionAlpha) * v +
                  newExpressions[k] * expressionAlpha,
              }),
              {}
            );
      });
    }

    if (
      expressionsSetter &&
      message.expressions &&
      message.expressions.expressions &&
      Object.keys(message.expressions.expressions).length > 0
    )
      handleExpressions(message.expressions.expressions);

    if (concentrationSetter)
      concentrationSetter(
        (oldConcentration) =>
          (1 - concentrationAlpha) * oldConcentration +
          concentrationAlpha * (message?.concentration.score || 0)
      );
  }

  function onQuestionQueueUpdate(room, { event, data }) {
    if (event === "remove") GetQuestionQueue(room);
    else if (event === "add") setQuestionQueue((oq) => oq.concat(data));
  }

  function onQuestionQueueStatus({ event, status, message }) {
    console.log("question queue status", event, status, message);
    if (event === "add" && status === true) {
      setOpts({
        type: "success",
        title: "Added To Queue",
        body: "You are now registered to ask a question",
      });
      setShow(true);
    }
  }

  function onQuestionQueue({ queue }) {
    setQuestionQueue(queue);
  }

  function onGetOwner({ owner }) {
    setOwner(owner);
  }

  function onPeerJoin(room, message) {
    Peer.createPeer(room, message, true, peers, myStream, setPeers);
  }

  function onPeerLeave(room, message) {
    Peer.destroyPeer(message.sessionId, peers, setPeers);
  }

  function onPeerSignal(room, message) {
    Peer.createPeer(room, message, false, peers, myStream, setPeers);
  }

  const onGeneralMessage = (msg) => {
    generalChatSetter && generalChatSetter((c) => [...c, msg]);
  };

  function onHandRecognition(message) {
    const gestureObject = Peer.onHandRecognition(message, peers);
    if (!gestureObject) {
      console.warn("onHandRecognition warning: gestureObject is null");
      return;
    }

    addGestureToVideo(gestureObject, gestureObject.sender);
  }

  useEffect(() => {
    console.log("Meeting.js -> rerender");
    // Join room
    if (!room) {
      // This is last - Either we joined after creating the room or after joining it regularly.
      function RegisterRoom(newRoom) {
        setRoom(newRoom);
        setIsOnline(true);
        refreshRoomCallbacks(newRoom);
      }
      // Try to create it first,
      async function CreateOrJoin() {
        const token = await getToken();
        const displayName = user.displayName;
        CreateRoom(token, displayName, meetingID)
          .then((room) => {
            // Create also joins room
            console.log("Create room -> Success", room);
            RegisterRoom(room);
          })
          .catch((e) => {
            // Maybe the room is not empty (rejoining) or isn't our room, just join it.
            console.log("Create room -> Failed", e);
            Join();
          });
      }
      async function Join() {
        const token = await getToken();
        const displayName = user.displayName;
        JoinRoom(token, meetingID, displayName)
          .then((newRoom) => {
            RegisterRoom(newRoom);
          })
          .catch((e) => {
            console.log(e);
            setError(e);
          });
      }
      CreateOrJoin();
    }

    return () => LeaveRoom(room);
  }, [room]);

  ////////
  // Peers
  ////////
  useEffect(() => {
    Peer.updateStream(myStream, peers, setPeers);
  }, [myStream]);

  useEffect(() => {
    // Closure hell - the callbacks can't figure out who peers are so I just update them naivly.
    refreshRoomCallbacks(room);
  }, [peers]);

  function addGestureToVideo(gestureObject, id) {
    const gestureTTL = 10000; // for timeout - show gesture on video object

    // Gesture exists = timeout to remove it also exists - need to abort first
    if (handGestures.current.has(id)) {
      clearTimeout(handGestures.current.get(id).removeTimeout);
    }

    // Set new gesture object
    handGestures.current.set(id, {
      ...gestureObject,
      removeTimeout: setTimeout(() => {
        document.getElementById(`hand-gesture-${id}`).innerText = "";
      }, gestureTTL),
    });

    // Place the corresponding gesture
    document.getElementById(`hand-gesture-${id}`).innerText =
      handGestureList[gestureObject.message];
  }

  function onHandRecognition(message) {
    const gestureObject = Peer.onHandRecognition(message, peers);
    if (!gestureObject) {
      console.warn("onHandRecognition warning: gestureObject is null");
      return;
    }

    const gesture = gestureObject.message;
    if (gesture === "raise_hand") {
      const userName = Peer.getNameFromID(gestureObject.sender, peers);
      addQuestion(gestureObject.sender, userName);
    }

    addGestureToVideo(gestureObject, gestureObject.sender);
  }

  /////
  // AI
  /////
  useEffect(() => {
    if (!HandGestures.IsReady()) {
      async function InitGestures() {
        await HandGestures.Init();
      }

      InitGestures();
    }

    if (!FaceRecognition.IsReady()) {
      async function InitFaceRecognition() {
        await FaceRecognition.Init();
      }

      InitFaceRecognition();
    }
    setMachineLearningReady(true);

    const hasVideoStream = !!myStream?.getVideoTracks().length > 0;

    // Remove interval if stream is offline
    if (detectionInterval.current && !hasVideoStream) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }

    // Add interval if stream is online
    if (!detectionInterval.current && hasVideoStream) {
      detectionInterval.current = setInterval(async () => {
        const gesturePrediction = await HandGestures.Detect(
          document.querySelector("#hiddenVideoEl")
        );
        const facePrediction = await FaceRecognition.Detect(
          document.querySelector("#hiddenVideoEl")
        );

        facePrediction?.score &&
          HandleConcentrationPrediction(facePrediction.score);
        facePrediction?.expressions &&
          handleExpressionsPrediction(facePrediction.expressions);
        gesturePrediction && HandleGesturePrediction(gesturePrediction);
      }, handIntervalTime);
    }

    return () => {
      detectionInterval.current && clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    };
  }, [myStream]);

  function HandleGesturePrediction(prediction) {
    // Send to room (other participants)
    SendHandGesture(room, prediction);

    if (prediction === "raise_hand") RegisterToMessageQueue(room);
    else if (prediction === "fist") RemoveFromMessageQueue(room);

    // Display on my video object
    const id = "me";
    const gestureObject = { message: prediction };
    addGestureToVideo(gestureObject, id);
  }

  function HandleConcentrationPrediction(score) {
    SendConcentrationPrediction(room, score);
  }

  function handleExpressionsPrediction(expressions) {
    SendExpressionsPrediction(room, expressions);
  }

  ////////////
  //Components
  ////////////

  if (error) {
    return <Error error={error} goBack={exitMeeting} />;
  }
  if (!isOnline || !machineLearningReady) {
    return <MeetingLoading />;
  }

  return (
    <div className={globalStyles}>
      <div className="h-full grid grid-flow-col grid-cols-10 grid-rows-1 relative">
        {showQuestionQueue && (
          <QuestionQueue
            questions={questionQueue}
            removeQuestionByID={removeQuestionByID}
          />
        )}
        {showExpressionsChart && (
          <ExpressionsChart onMount={onExpressionsChartMount} />
        )}
        {showConcentrationMeter && (
          <ConcentrationMeter onMount={onConcentrationMeterMount} />
        )}
        <div
          className={
            "grid grid-rows-10 grid-flow-row h-full " +
            (participants || chat ? "col-span-7" : "col-span-10")
          }
        >
          {/* Hidden video element for hand recognition etc */}
          <video
            className="hidden"
            id="hiddenVideoEl"
            ref={(e) => {
              if (e) e.srcObject = myStream;
            }}
            autoPlay={true}
          ></video>

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
              questionQueue={showQuestionQueue}
              toggleQuestionQueue={toggleQuestionQueue}
              expressions={showExpressionsChart}
              toggleExpressions={toggleExpressionsChart}
              concentration={showConcentrationMeter}
              toggleConcentration={toggleConcentrationMeter}
            />
          </div>
        </div>
        {/* Chat Div */}
        <div className="flex flex-col w-full h-full col-span-3 divide-y-2 divide-opacity-50">
          {chat && (
            <Chat
              sendMessage={sendMessageFromChat}
              onMount={onChatMount}
              isParticipantsOpen={participants}
            />
          )}
          {participants && (
            <Participants
              peers={peers}
              cameraState={camera}
              microphoneState={microphone}
              isChatOpen={chat}
            />
          )}
        </div>
        {showConnectionTime && (
          <div className="absolute w-full">
            <div className="justify-center text-center self-center flex flex-col items-center content-center ">
              <Timer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
