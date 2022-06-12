import Peer from "simple-peer";
import useMeeting from "../stores/meetingStore";

export default function UsePeer() {
  const { addPeer, removePeerById, getPeerById, getPeers } = useMeeting();

  function constructPeerObject(id, uid, peerObject, roomObject, name) {
    return {
      id: id,
      uid: uid,
      peer: peerObject,
      room: roomObject,
      name: name,
    };
  }
  // Connections
  ///////////////////////////////////

  /**
   * Creates (or negotiates signal) peer.
   * @param {Object} room
   * @param {Object} message
   * @param {Boolean} initiator
   * @param {MediaStream} myStream
   * @returns
   */
  function createPeer(room, message, initiator, myStream) {
    const id = message.sessionId;
    console.log(message, `initator: ${initiator}`);
    const peerExists = getPeerById(message.sessionId);
    console.log(
      `peerExists: ${!!peerExists} nPeers: ${getPeers().length}`,
      getPeers()
    );
    peerExists &&
      console.log(peerExists, `destroyed: ${peerExists.peer.destroyed}`);
    if (!initiator && peerExists && !peerExists.peer.destroyed) {
      // Recieved signal
      peerExists.peer.signal(message.data);
      return;
    }

    if (myStream) myStream.getTracks().forEach((t) => (t.enabled = true));

    const peer = new Peer({
      initiator: initiator,
      trickle: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
      stream: myStream ? myStream : false,
    });

    try {
      initiator || peer.signal(message.data);
    } catch (e) {
      console.log("peer signal error", e);
    }

    function refreshPeer() {
      console.log("refreshing peer (track event)");
      removePeerById(id);
      if (!peer.destroyed)
        addPeer(constructPeerObject(id, message.uid, peer, room, message.name));
    }

    peer.on("signal", (data) => {
      console.log("signaling peer");
      room.send("signal", { sessionId: message.sessionId, data: data });
    });

    peer.on("connect", () => {
      console.log("connected with peer");
    });

    peer.on("close", () => {
      console.log("closed connection with peer");
      destroyPeer(id);
    });

    peer.on("track", (track, stream) => {
      track.addEventListener("unmute", refreshPeer);
      track.addEventListener("mute", refreshPeer);
      track.addEventListener("ended", refreshPeer);
    });

    peer.on("stream", (peerStream) => {
      console.log("onStream", peerStream.getTracks());
    });

    peer.on("error", (err) => {
      console.warn(err, "<- usePeer error from ", id);
    });

    if (!peerExists) {
      console.log("adding peer");
      addPeer(constructPeerObject(id, message.uid, peer, room, message.name));
    }
  }

  /**
   * Destroys a peer
   * @param {String} peerToRemoveId
   * @param {Array} peers
   * @param {Function} setter
   */
  function destroyPeer(peerToRemoveId) {
    try {
      console.log("destroying peer", peerToRemoveId);
      const peerToRemove = getPeerById(peerToRemoveId);
      console.log(peerToRemove, getPeers());
      if (!peerToRemove) return;
      if (!peerToRemove.peer.destroyed) peerToRemove.peer.destroy();
      removePeerById(peerToRemoveId);
    } catch (e) {
      console.log("destroyPeer error", e);
    }
  }

  function updateParticipants(participantObject, room, myStream) {
    console.log("updating participants", participantObject);
    Object.keys(participantObject)
      .filter((sessionId) => !getPeers()[sessionId])
      .forEach((sessionId) => {
        createPeer(room, participantObject[sessionId], true, myStream);
      });

    // reconnect timeout
    setTimeout(() => {
      const unconnectedPeers = getPeers().filter(
        (peer) => peer.peer._connected === false
      );
      var filteredParticipantObject = {};
      unconnectedPeers.forEach((peer) => {
        console.log("reconnecting to because connected was false", peer.id);
        filteredParticipantObject[peer.id] = participantObject[peer.id];
        destroyPeer(peer.id);
        removePeerById(peer.id);
      });

      unconnectedPeers.length > 0 &&
        updateParticipants(filteredParticipantObject, room, myStream);
    }, 5000);
  }
  ///////////////////////////////////

  // Stream
  ///////////////////////////////////

  /**
   * Removes client stream in other clients
   * @param {MediaStream} stream
   * @param {Array} peers
   * @param {Function} setter
   */
  function removeStreamFromPeers(stream) {
    if (!stream || !getPeers()) return;
    getPeers().forEach((peer) => {
      if (!peer.peer.destroying && !peer.peer.destroyed)
        peer.peer.removeStream(stream);
    });
  }
  function updateStream(stream) {
    if (!stream || !getPeers()) return;
    getPeers().forEach((peer) => {
      if (!peer.peer?.destroying && !peer.peer?.destroyed) {
        peer.peer.addStream(stream);
      }
    });
  }

  ///////////////////////////////////

  // Screen share
  ///////////////////////////////////
  function removeScreenShare(stream) {
    if (!stream) return;
    getPeers().forEach(
      (peer) => peer && !peer.peer.destroyed && peer.peer.removeStream(stream)
    );
  }

  function addScreenShare(stream) {
    if (!stream) return;

    getPeers().forEach((peer) =>
      peer.peer.send({ event: "share-screen", id: stream.id })
    );
    getPeers().forEach((peer) => {
      peer.peer.addStream(stream);
    });
  }
  ///////////////////////////////////

  // ETC
  ///////////////////////////////////

  /**
   *
   * @param {Object} message
   * @param {Array} peers
   * @returns
   */
  function onPeerHandRecognition(message) {
    const peerExists = getPeerById(message.sender);
    if (!peerExists) return false;
    const gestureObject = {
      message: message.message,
      time: message.time,
      sender: message.sender,
    }; // Create object for this gesture

    return gestureObject;
  }

  function getNameFromID(id) {
    const peerExists = getPeerById(id);
    if (!peerExists) return false;
    return peerExists.name;
  }
  ///////////////////////////////////

  return {
    addScreenShare,
    removeScreenShare,
    removeStreamFromPeers,
    updateStream,
    onPeerHandRecognition,
    getNameFromID,
    updateParticipants,
    destroyPeer,
    createPeer,
  };
}
