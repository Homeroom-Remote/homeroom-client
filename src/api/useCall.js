import { useState, useEffect, useCallback } from "react";
import Peer from "peerjs";
import io from "socket.io-client";

const errors = {
  bad_socket_url: "Bad socket URL",
};

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
  defaultID = undefined,
  peerConnection = peerConnectionObject,
  socketPath = "http://localhost:3030/"
) {
  const [me, setMe] = useState(null);
  const [socket, setSocket] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [id, setId] = useState(null);
  const [peers, setPeers] = useState([]);

  const peerExists = useCallback(
    (userID) =>
      !!peers.find((existingPeer) => existingPeer.call.peer === userID),
    [peers]
  );
  function addCallToPeers(call, peerMediaStream) {
    const peerObject = {
      call: call,
      media: peerMediaStream,
    };
    setPeers((lastPeersState) => [...lastPeersState, peerObject]);
  }

  const handlePeerConnect = useCallback(
    (peerID) => {
      if (peerID === id) {
        console.warn("Ignored connection with same ID as my ID");
        return;
      }
      if (peerExists(peerID)) {
        // Do not try and connect to an existing peer
        console.warn("peerID already connected to");
        return;
      }

      if (!me) {
        console.warn(
          "Can't connect with",
          peerID,
          "because peerJS isn't initialized"
        );
        return;
      }

      console.log("Attempting to connect with", peerID);

      const stream = myStream;

      const call = me.call(peerID, stream);
      call?.on("error", (err) => console.warn(err));

      if (!call) {
        console.warn("Call to", peerID, "failed");
        return;
      }

      console.log("Connected with", peerID, call);

      call.on("stream", (peerStream) => {
        console.log("on stream");
        addCallToPeers(call, peerStream);
      });
    },
    [peerExists, me, id, myStream]
  );

  const handlePeerDisconnect = useCallback(
    (peerID) => {
      // destroy every call object that matches
      const callObjectsFromPeers = peers.filter(
        (peer) => peer.call.peer === peerID
      );
      for (const peer of callObjectsFromPeers) {
        peer.call.close();
      }

      // filter out every call with peer
      const filteredOutPeersArray = peers.filter(
        (peer) => peer.call.peer !== peerID
      );
      setPeers(filteredOutPeersArray);
    },
    [peers]
  );

  useEffect(() => {
    if (!me || !meetingID || !id) {
      return;
    }

    if (!socketPath) {
      console.warn(errors["bad_socket_url"]);
      return;
    }

    if (!socket) {
      setSocket(io(socketPath));
    }
    if (socket?.connected) {
      return;
    }
    console.log("hey");

    if (socket && id !== null && meetingID) {
      socket.emit("join-room", meetingID, id);

      socket.on("user-disconnected", (peerID) => handlePeerDisconnect(peerID));

      socket.on("user-connected", (peerID) => {
        handlePeerConnect(peerID);
      });
    }

    return () => socket && socket.close();
  }, [
    socketPath,
    id,
    meetingID,
    handlePeerDisconnect,
    handlePeerConnect,
    me,
    socket,
  ]);
  useEffect(() => {
    const me = new Peer(defaultID, {
      path: peerConnection.path,
      host: peerConnection.host,
      port: peerConnection.port,
    });

    setId(defaultID);
    setMe(me);
    me.on("open", (id) => {
      console.log("New PeerJS ID:", id);
      setId(id);
    });

    me.on("call", (call) => {
      const stream =
        myStream ||
        new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack()]);
      const peerID = call.peer;
      console.log("Incoming call from ", peerID);

      if (!peerExists(peerID)) {
        call.answer(stream);

        call.on("stream", (peerVideoStream) => {
          addCallToPeers(call, peerVideoStream);
        });
      }
    });
  }, [defaultID, peerConnection, peerExists, myStream]);

  return { id, peers, setMyStream, myStream };
}
