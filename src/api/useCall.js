import { useState, useEffect } from "react";
import Peer from "peerjs";

export default function useCall(
  path = "/peerjs",
  host = "localhost",
  port = "3030"
) {
  const [peer, setPeer] = useState(null);
  const [id, setId] = useState(null);
  const [peers, setPeers] = useState([]);
  const [callError, setCallError] = useState(null);

  useEffect(() => {
    const peer = new Peer(undefined, {
      path: path,
      host: host,
      port: port,
    });

    setPeer(peer);

    peer.on("open", (id) => {
      setId(id);
    });

    peer.on("call", (request) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          request.answer(stream);
        });
      console.log("incoming call:");
      console.log(request);
    });
  }, [host, path, port]);

  function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    if (!call) {
      setCallError("Couldn't establish a call");
      return;
    }

    setCallError(null);
    console.log("Established call", call);

    call.on("stream", (userVideoStream) => {
      console.log("new stream");
      let newPeers = peers;
      newPeers[userId] = { ...call, video: userVideoStream };
      setPeers(newPeers);
    });

    call.on("close", () => {
      console.log("call closed");
      let newPeers = peers;
      delete newPeers[userId];
      setPeers(newPeers);
    });

    setPeers((lastPeers) => ({ ...lastPeers, userId: call }));
  }

  return { id, peers, connectToNewUser, callError };
}
