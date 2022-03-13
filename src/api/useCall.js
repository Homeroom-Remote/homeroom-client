import { useState, useEffect } from "react";
import Peer from "peerjs";

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

  function callFromArray(array, stream) {
    if (!array) return;
    for (const participantID of array) {
      console.log("Trying to connect to ", participantID);
      connectToNewUser(participantID, stream);
    }
  }

  return { id, peers, connectToNewUser, callError, callFromArray };
}
