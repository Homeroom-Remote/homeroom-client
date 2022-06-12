import Peer from "simple-peer";

/**
 * Updated peers given an id, new object & setter (setPeer)
 * @param {String} id
 * @param {Object} obj
 * @param {Function} setter
 */
function updatePeers(id, obj, setter) {
  setter((prev) => {
    let filtered = prev.filter((peer) => peer.id !== id);
    return [...filtered, obj];
  });
}

function removeScreenShare(stream, peers) {
  if (!stream) return;
  peers.forEach((peer) => peer.peer.removeStream(stream));
}

function addScreenShare(stream, peers) {
  if (!stream) return;

  peers.forEach((peer) =>
    peer.peer.send({ event: "share-screen", id: stream.id })
  );
  peers.forEach((peer) => {
    peer.peer.addStream(stream);
  });
}

/**
 * Removes client stream in other clients
 * @param {MediaStream} stream
 * @param {Array} peers
 * @param {Function} setter
 */
function removeStreamFromPeers(stream, peers) {
  if (!stream || !peers) return;
  peers.forEach((peer) => {
    if (!peer.peer.destroying) peer.peer.removeStream(stream);
  });
}

/**
 * Updates client stream in other clients
 * @param {MediaStream} stream
 * @param {Array} peers
 * @param {Function} setter
 */
function updateStream(stream, peers) {
  if (!stream || !peers) return;
  peers.forEach((peer) => {
    if (!peer.peer.destroying) {
      peer.peer.addStream(stream);
    }
  });
}

function updateParticipants(participantObject, peers, setter, room, myStream) {
  Object.keys(participantObject)
    .filter((sessionId) => !peers[sessionId])
    .forEach((sessionId) => {
      console.log(`Initiating new connection with ${sessionId}`);
      createPeer(
        room,
        participantObject[sessionId],
        true,
        peers,
        myStream,
        setter
      );
    });
}

/**
 * Creates (or negotiates signal) peer.
 * @param {Object} room
 * @param {Object} message
 * @param {Boolean} initiator
 * @param {Array} peers
 * @param {MediaStream} myStream
 * @param {Function} setter
 * @returns
 */
function createPeer(room, message, initiator, peers, myStream, setter) {
  const peerExists = peers.find((peer) => peer.id === message.sessionId);
  console.log(`peerExists: ${!!peerExists} nPeers: ${peers.length}`);
  peerExists && console.log(peerExists);
  if (!initiator && peerExists) {
    // Recieved signal
    peerExists.peer.signal(message.data);
    return;
  }

  const peer = new Peer({
    initiator: initiator,
    trickle: true,
    stream: myStream || false,
  });

  peer.on("signal", (data) => {
    console.log("signaling peer");
    room.send("signal", { sessionId: message.sessionId, data: data });
  });

  peer.on("connect", () => {
    console.log("connected with peer");
  });

  peer.on("close", () => {
    console.log("closed connection with peer");
  });

  updatePeers(
    message.sessionId,
    {
      id: message.sessionId,
      uid: message.uid,
      peer: peer,
      room: room,
      name: message.name,
    },
    setter
  );

  // initiator || peer.signal(message.data);
  peer.on("track", (track, stream) => {
    console.log("track", track, stream);
    function removeTrack() {
      console.log("removing track");
      // track.stop();
      // stream.removeTrack(track);
    }
    function addTrack() {}
    track.addEventListener("mute", removeTrack);
    track.addEventListener("ended", removeTrack);
    track.addEventListener("unmute", (e) => console.log("track unmute", e));
  });

  peer.on("stream", (peerStream) => {
    console.log(peerStream.getTracks());
    updatePeers(
      message.sessionId,
      {
        id: message.sessionId,
        uid: message.uid,
        peer: peer,
        room: room,
        name: message.name,
        stream: peerStream,
      },
      setter
    );
  });

  peer.on("error", (err) => {
    console.warn(err, "<- usePeer error from ", message.sessionId);
  });

  updatePeers(
    message.sessionId,
    {
      id: message.sessionId,
      uid: message.uid,
      peer: peer,
      room: room,
      name: message.name,
    },
    setter
  );
}

/**
 * Destroys a peer
 * @param {String} peerToRemoveId
 * @param {Array} peers
 * @param {Function} setter
 */
function destroyPeer(peerToRemoveId, peers, setter) {
  console.log("destroying peer", peerToRemoveId);
  const peerToRemove = peers.find((peer) => peer.id === peerToRemoveId);
  console.log(peerToRemove);
  peerToRemove?.peer?.destroy();
  setter((prev) => prev.filter((peer) => peer.id !== peerToRemoveId));
}

/**
 *
 * @param {Object} message
 * @param {Array} peers
 * @returns
 */
function onHandRecognition(message, peers) {
  const peerExists = peers.find((peer) => peer.id === message.sender);
  if (!peerExists) return false;
  const gestureObject = {
    message: message.message,
    time: message.time,
    sender: message.sender,
  }; // Create object for this gesture

  return gestureObject;
}

function getNameFromID(id, peers) {
  const peerExists = peers.find((peer) => peer.id === id);
  if (!peerExists) return false;
  return peerExists.name;
}

const PeerWrapper = {
  createPeer,
  destroyPeer,
  onHandRecognition,
  updateStream,
  removeStreamFromPeers,
  getNameFromID,
  addScreenShare,
  removeScreenShare,
  updateParticipants,
};
export default PeerWrapper;
