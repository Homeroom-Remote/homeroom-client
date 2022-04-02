import * as Colyseus from "colyseus.js";
import { useState, useEffect } from "react";
import { getToken } from "./auth";

const defaultWsUrl = `ws://${window.location.hostname}:3030`;

export default function RoomManager(meetingID, options) {
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [room, setRoom] = useState(null);

  function registerMessages(messagesCallbackList) {
    room.removeAllListeners();
    if (!room) throw Error("Room not yet initialized");
    messagesCallbackList.forEach((mcObject) => {
      const { name, callback } = mcObject;
      if (!name || !callback) throw Error("Invalid message name/callback");
      room.onMessage(name, callback);
    });
  }

  useEffect(() => {
    if (room) {
      return () => room.leave();
    }
  }, [room]);

  useEffect(() => {
    const wsUrl = options?.wsUrl || defaultWsUrl;
    const newClient = new Colyseus.Client(wsUrl);
    setClient(newClient);

    async function joinRoom() {
      try {
        const token = await getToken();
        const room = await newClient.joinOrCreate("peer", {
          accessToken: token,
          meetingId: meetingID,
        });
        setRoom(room);
        setIsOnline(true);
      } catch (e) {
        console.error("join room error", e);
        setError(e);
      }
    }

    joinRoom();
  }, [options]);

  return { isOnline, error, registerMessages };
}
