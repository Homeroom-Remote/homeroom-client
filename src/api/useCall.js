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
  const closeHandler = (peerID) => {
    console.log("Closing call with", peerID);
    removePeer(peerID);
  };

  const callErrorHandler = (error) => {
    console.warn("Call error", error);
  };

  function removePeer(peerID) {
    console.log("Removing peer", peerID);
    if (!peerID || peerID === userID) return;

    var peersCopy = peers;
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

    console.log("Call to", peerID, "established", callObject);

    var call = createCall();
    call.id = peerID;
    call.callObject = callObject;

    const newPeers = peers;
    newPeers[peerID] = call;
    setPeers(newPeers);

    callObject.on("stream", (peerStream) => {
      console.log("getting stream");
      call.stream = peerStream;
      var newPeers = peers;
      newPeers[peerID] = call;
      setPeers({ ...newPeers });
    });

    callObject.on("error", callErrorHandler);
    callObject.on("close", () => closeHandler(callObject.peer));
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
        console.log("Got a call", callObject, peers);
        callObject.answer(myStream);

        var newPeers = peers;
        newPeers[call.id] = call;
        setPeers(newPeers);

        callObject.on("stream", (peerStream) => {
          call.stream = peerStream;

          var newPeers = peers;
          newPeers[call.id] = call;
          setPeers({ ...newPeers });
        });

        callObject.on("error", callErrorHandler);
        callObject.on("close", () => closeHandler(callObject.peer));
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

    return () => newSocket.close();
  }, [socketPath, userID, meetingID]);

  return { peers, setMyStream, myStream, onMediaStreamChange };
}
