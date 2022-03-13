import { useState, useEffect } from "react";
import Peer from "peerjs";

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

export default function useCall(
  defaultID = undefined,
  path = "/peerjs",
  host = "localhost",
  port = "3030"
) {
  const [me, setMe] = useState(null);
  const [id, setId] = useState(null);
  const [peers, setPeers] = useState([]);
  const [callError, setCallError] = useState(null);

  useEffect(() => {
    const me = new Peer(defaultID, {
      path: path,
      host: host,
      port: port,
    });

    setId(defaultID);
    setMe(me);
    me.on("open", (id) => {
      console.log("new id", id);
      setId(id);
    });

    me.on("call", (request) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          request.answer(stream);
        });
      console.log("incoming call:");
      console.log(request);
    });

    return () => {
      console.log("Destroying peer object");
      me.disconnect();
      me.destroy();
    };
  }, [host, path, port, defaultID]);

  function connectToNewUser(userId, stream) {
    console.log("Trying to connect to ", userId, peers);

    if (peers.find((existingPeer) => existingPeer.peer === userId)) {
      console.warn("Peer ", userId, " already on call.");
      console.log(peers);
      return;
    }

    if (!stream) {
      stream = new MediaStream([
        createEmptyAudioTrack(),
        createEmptyVideoTrack({ width: 640, height: 480 }),
      ]);
    }
    const call = me.call(userId, stream);
    if (!call) {
      setCallError("Couldn't establish a call");
      return;
    }

    setCallError(null);
    console.log("Established call", call);

    call.on("stream", (userVideoStream) => {
      console.log("new stream");
      let newPeers = peers;
      newPeers.push({ ...call, stream: userVideoStream });
      setPeers([...newPeers]);
    });

    call.on("close", () => {
      console.log("call closed", peers);
      let newPeers = peers;
      setPeers(newPeers);
    });
  }

  function callFromArray(array, stream) {
    if (!array) return;
    for (const participantID of array) {
      connectToNewUser(participantID, stream);
    }
  }

  return { id, peers, connectToNewUser, callError, callFromArray };
}
