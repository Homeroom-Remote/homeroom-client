import { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Chat from "./Chat";
import VideoWrapper from "./VideoWrapper";
import Participants from "./Participants";
import Error from "./Error";
import MeetingLoading from "./MeetingLoading";

import useMeeting from "../../stores/meetingStore";
import useVideoSettings from "../../stores/videoSettingsStore";
import usePeer from "../../api/usePeer";
import useUser from "../../stores/userStore";
import { getToken } from "../../api/auth";
import {
  CreateRoom,
  JoinRoom,
  LeaveRoom,
  RegisterMessages,
  SendChatMessage,
} from "../../api/room";

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

  // Loading/Error hooks
  const [error, setError] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Child component hooks
  const [chat, setChat] = useState(false);
  const [participants, setParticipants] = useState(false);
  let generalChatSetter = null;

  // Room hooks
  const [room, setRoom] = useState(null);
  const { meetingID, exitMeeting } = useMeeting();

  // etc
  const { createPeer, destroyPeer, peers } = usePeer(myStream);
  const { user } = useUser();

  ////////
  // Media
  ////////
  const toggleCamera = () => setCamera(!camera);
  const toggleMicrophone = () => setMicrophone(!microphone);

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

  const onGeneralMessage = (msg) => {
    generalChatSetter && generalChatSetter((c) => [...c, msg]);
  };

  const onChatMount = (dataFromChat) => {
    generalChatSetter = dataFromChat[1];
    refreshRoomCallbacks(room);
  };

  // Room

  function refreshRoomCallbacks(room) {
    if (!room) return;
    RegisterMessages(room, [
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
        callback: (room, message) => onGeneralMessage(message),
      },
    ]);
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

  ////////////
  //Components
  ////////////

  if (error) {
    return <Error error={error} goBack={exitMeeting} />;
  }
  if (!isOnline) {
    return <MeetingLoading />;
  }

  return (
    <div className={globalStyles}>
      <div className="h-full grid grid-flow-col grid-cols-10 grid-rows-1">
        <div
          className={
            "grid grid-rows-10 grid-flow-row bg-red-200 h-full " +
            (participants || chat ? "col-span-7" : "col-span-10")
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
      </div>
    </div>
  );
}
