import { useState, useEffect } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import socketHandler from "./socket";

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
  canvas.getContext("2d").fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

export const peerConnectionObject = {
  path: "/peerjs",
  host: "localhost",
  port: "3030",
};

export default function useCall(
  meetingID,
  userID,
  peerConnection = peerConnectionObject,
  socketPath = "http://localhost:3033/"
) {
  const [me, setMe] = useState(null);
  const [socket, setSocket] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [callQueue, setCallQueue] = useState([]);

  /////////
  // PeerJS
  /////////
  useEffect(() => {
    //////////////////
    // Initialize Peer
    //////////////////
    var myPeerHandler = me;

    // Either we have a stream or we need to send an empty MediaStream to trick peerJS
    const stream =
      myStream ||
      new MediaStream([
        createEmptyAudioTrack(),
        createEmptyVideoTrack({ width: 640, height: 280 }),
      ]);
    console.log(stream, myStream);

    if (!me) {
      const myPeerHandler = new Peer(userID, {
        path: peerConnection.path,
        host: peerConnection.host,
        port: peerConnection.port,
      });

      setMe(myPeerHandler);

      myPeerHandler.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (peerMediaStream) => {
          setPeers((peers) => ({ ...peers, [call.peer]: peerMediaStream }));
        });
      });
    }

    ////////////////////
    // Handle call queue
    ////////////////////
    if (callQueue.length > 0) {
      // Call each ID in the queue
      callQueue.forEach((callID) => {
        const call = myPeerHandler.call(callID, stream);

        if (!call) {
          console.warn("Calling", callID, "Failed");
          return;
        }
        call.on("stream", (peerStream) => {
          call.answer(stream);
          setPeers((peers) => ({ ...peers, [callID]: peerStream }));
        });
      });

      // Reset queue (for now, might change this later)
      setCallQueue([]);
    }
  }, [callQueue, me, myStream, peerConnection, userID]);

  /////////
  // Socket
  /////////
  useEffect(() => {
    ////////////////////
    // Initialize socket
    ////////////////////
    const newSocket = io(socketPath);
    setSocket(newSocket);

    ////////////
    // Join Room
    ////////////
    socketHandler.joinRoom(newSocket, meetingID, userID);
    newSocket.emit("ready");

    ////////////////////////
    // Socket Event Handlers
    ////////////////////////
    socketHandler.onNewUserInRoom(newSocket, (peerID) => {
      console.log(peerID, "joined the room");
      setCallQueue((formerQueue) => [...formerQueue, peerID]);
    });
    socketHandler.onUserLeaveRoom(newSocket, (peerID) => {
      console.log(peerID, "left the room");
      setPeers((peers) => ({ ...peers, [peerID]: undefined }));
    });
    return () => newSocket.close();
  }, [socketPath, userID, meetingID]);

  return { peers, setMyStream, myStream };
}
