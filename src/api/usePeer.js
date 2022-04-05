import { useState, useEffect } from "react";
import Peer from "simple-peer";

export default function usePeer(mediaConstraints) {
  const [peers, setPeers] = useState([]);
  const [myStream, setMyStream] = useState(null);

  function getMedia(constraints) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  function updatePeers(id, obj) {
    setPeers((prev) => {
      let filtered = prev.filter((peer) => peer.id !== id);
      return [...filtered, obj];
    });
  }

  function updateStream(mediaConstraints) {
    getMedia(mediaConstraints)
      .then((newStream) =>
        peers.forEach(({ peer }) => {
          peer.send("hey");
          peer.addStream(newStream);
        })
      )
      .catch(() => {});
  }

  useEffect(() => {
    // console.table(peers);
  }, [peers]);

  useEffect(() => {
    updateStream(mediaConstraints);
  }, [mediaConstraints]);

  function createPeer(room, message, initiator) {
    const peerExists = peers.find((peer) => peer.id === message.sessionId);
    if (!initiator && peerExists) {
      // Recieved signal
      peerExists.peer.signal(message.data);
      return;
    }
    const peer = new Peer({ initiator: initiator, trickle: false });

    initiator || peer.signal(message.data);

    peer.on("signal", (data) => {
      room.send("signal", { sessionId: message.sessionId, data: data });
    });

    peer.on("stream", (peerStream) => {
      console.log(peerStream, "-> stream recieved");
    });

    peer.on("error", (err) => {
      console.warn(err, "-> usePeer error from ", message.sessionId);
    });

    updatePeers(message.sessionId, {
      id: message.sessionId,
      peer: peer,
      room: room,
    });
  }

  function destroyPeer(peerToRemoveId) {
    const peerToRemove = peers.find((peer) => peer.id === peerToRemoveId);
    peerToRemove?.peer.destroy();
    setPeers((prev) => prev.filter((peer) => peer.id !== peerToRemoveId));
  }

  return { createPeer, destroyPeer, myStream };
}
