import { useState, useEffect } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import socketHandler from "./socket";

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

  const Call = {
    id: null,
    callObject: null,
    stream: null,
  };

  const createCall = () => Object.assign({}, Call);

  function removePeer(peerID) {
    console.log("Removing peer", peerID);
    if (!peerID) return;

    const peersCopy = peers;
    delete peersCopy[peerID];
    setPeers({ ...peersCopy });
  }

  function initCall(peerID) {
    if (!peerID || !me || !myStream) return;

    console.log("Trying to connect to", peerID);
    const callObject = me.call(peerID, myStream);

    if (!callObject) {
      console.warn("Calling", peerID, "Failed");
      return;
    }

    console.log("Call to", peerID, "established");

    console.log(peers);

    var call = createCall();
    call.id = peerID;
    call.callObject = callObject;

    callObject.on("stream", (peerStream) => {
      callObject.answer(myStream);
      call.stream = peerStream;

      const oldPeers = peers;
      oldPeers[peerID] = call;
      setPeers({ ...oldPeers });
    });

    callObject.on("close", () => {
      removePeer(peerID);
    });
  }
  function refreshCallsAfterNewMediaStream() {
    socketHandler.newStream(socket);
    Object.keys(peers).forEach((peer) => {
      const call = peers[peer];
      if (!call.id || !call.callObject) return;
      call.callObject.close();
      removePeer(call.id);
      initCall(call.id);
    });
  }

  const onMediaStreamChange = () =>
    me &&
    Object.keys(peers).length > 0 &&
    myStream &&
    refreshCallsAfterNewMediaStream();

  /////////////////
  // PeerJS Cleanup
  /////////////////
  useEffect(() => {
    return () => {
      if (me) {
        console.log("Closing PeerJS Connection");
        me?.destroy();
      }
    };
  }, [me]);

  /////////
  // PeerJS
  /////////
  useEffect(() => {
    //////////////////
    // Initialize Peer
    //////////////////

    if (!myStream) return;

    if (!me) {
      const myPeerHandler = new Peer(userID, {
        path: peerConnection.path,
        host: peerConnection.host,
        port: peerConnection.port,
      });

      setMe(myPeerHandler);

      myPeerHandler.on("call", (callObject) => {
        var call = createCall();
        call.id = callObject.peer;
        call.callObject = callObject;
        console.log("Got a call", callObject);
        callObject.answer(myStream);
        callObject.on("stream", (peerMediaStream) => {
          call.stream = peerMediaStream;
          const oldPeers = peers;
          oldPeers[call.id] = call;
          setPeers({ ...oldPeers });
        });

        callObject.on("close", () => {
          removePeer(callObject.peer);
        });
      });
      myPeerHandler.on("error", (error) => {
        console.warn("peerjs error", error);
      });
    }

    ////////////////////
    // Handle call queue
    ////////////////////
    if (callQueue.length > 0) {
      // Call each ID in the queue
      callQueue.forEach((callID) => {
        initCall(callID);
      });

      // Reset queue (for now, might change this later)
      setCallQueue([]);
    }
    /////////////////////////////
    // Destruct PeerJS Connection
    /////////////////////////////
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
      removePeer(peerID);
    });

    socketHandler.onNewStream(newSocket, (peerID) => {
      console.log(peerID, "changing stream");
      removePeer(peerID);
    });
    return () => newSocket.close();
  }, [socketPath, userID, meetingID]);

  return { peers, setMyStream, myStream, onMediaStreamChange };
}
