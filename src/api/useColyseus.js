import * as Colyseus from "colyseus.js";
import { useState, useEffect } from "react";
import { getToken } from "./auth";
import useUser from "../stores/userStore";

const defaultWsUrl = `ws://${window.location.hostname}:3030`;

export default function RoomManager(meetingID, options) {
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const { user } = useUser();

  function registerMessages(messagesCallbackList) {
    room.removeAllListeners();
    if (!room) throw Error("Room not yet initialized");
    messagesCallbackList.forEach((mcObject) => {
      const { name, callback } = mcObject;
      if (!name || !callback) throw Error("Invalid message name/callback");
      room.onMessage(name, (message) => callback(room, message));
    });
  }

  function sendChatMessage(message) {
    if (!room) return;
    room.send("chat-message", message);
  }

  useEffect(() => {
    if (room) {
      return () => room.leave();
    }
  }, [room]);

  useEffect(() => {
    const wsUrl = options?.wsUrl || defaultWsUrl;
    const newClient = new Colyseus.Client(wsUrl);

    async function joinRoom() {
      try {
        const token = await getToken();
        const room = await newClient.joinOrCreate("peer", {
          accessToken: token,
          meetingId: meetingID,
          name: user.displayName,
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

  return { isOnline, error, registerMessages, sendChatMessage };
}
