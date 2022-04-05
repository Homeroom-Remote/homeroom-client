import { useState, useEffect } from "react";
import Peer from "simple-peer";

export default function usePeer(myStream) {
  const [peers, setPeers] = useState([]);

  function updatePeers(id, obj) {
    setPeers((prev) => {
      let filtered = prev.filter((peer) => peer.id !== id);
      return [...filtered, obj];
    });
  }

  function updateStream() {
    // Remove former stream
    peers.forEach((peer) => {
      if (peer.localStream) {
        peer.peer.removeStream(peer.localStream);
        console.log("deleted stream");
      }

      if (myStream) {
        peer.peer.addStream(myStream);
        let peerCopy = { ...peer, localStream: myStream };
        updatePeers(peerCopy.id, peerCopy);
      }
    });
  }

  useEffect(() => {
    updateStream();
  }, [myStream]);

  function createPeer(room, message, initiator) {
    const peerExists = peers.find((peer) => peer.id === message.sessionId);
    if (!initiator && peerExists) {
      // Recieved signal
      peerExists.peer.signal(message.data);
      return;
    }
    const peer = new Peer({
      initiator: initiator,
      trickle: true,
      stream: myStream,
    });

    initiator || peer.signal(message.data);

    peer.on("signal", (data) => {
      room.send("signal", { sessionId: message.sessionId, data: data });
    });

    peer.on("stream", (peerStream) => {
      updatePeers(message.sessionId, {
        id: message.sessionId,
        peer: peer,
        room: room,
        name: message.name,
        stream: peerStream,
      });
      console.log(peerStream, "-> stream recieved");
    });

    peer.on("error", (err) => {
      console.warn(err, "-> usePeer error from ", message.sessionId);
    });

    peer.on("track", (track, stream) => {
      // Mute happens when track is removed (audio and video)
      track.addEventListener("mute", () => {
        updatePeers(message.sessionId, {
          id: message.sessionId,
          peer: peer,
          room: room,
          name: message.name,
          stream: stream,
        });
      });
    });

    updatePeers(message.sessionId, {
      id: message.sessionId,
      peer: peer,
      room: room,
      name: message.name,
    });
  }

  function destroyPeer(peerToRemoveId) {
    const peerToRemove = peers.find((peer) => peer.id === peerToRemoveId);
    peerToRemove?.peer.destroy();
    setPeers((prev) => prev.filter((peer) => peer.id !== peerToRemoveId));
  }

  return { createPeer, destroyPeer, peers };
}
