import * as Colyseus from "colyseus.js";

const wsURL = `ws://${window.location.hostname}:3030`;
const client = new Colyseus.Client(wsURL);

/**
 * Joins a room
 * @param {String} userToken
 * @param {String} meetingID
 * @param {String} displayName
 * @returns {Promise} Joined/Failed
 */
async function JoinRoom(userToken, meetingID, displayName) {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await client.joinById(meetingID, {
        accessToken: userToken,
        meetingId: meetingID,
        name: displayName,
      });
      resolve(room);
    } catch (e) {
      reject({ name: "Join room error", error: e });
    }
  });
}

/**
 * Creates a room
 * @param {String} userToken
 * @param {String} meetingID
 * @param {String} displayName
 * @returns {Promise} Created/Failed
 */
async function CreateRoom(userToken, displayName, meetingID) {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await client.create("peer", {
        accessToken: userToken,
        meetingId: meetingID,
        name: displayName,
      });
      resolve(room);
    } catch (e) {
      reject({ name: "Create room error", error: e });
    }
  });
}

function LeaveRoom(room) {
  room && room.leave();
}

function RegisterMessages(room, messageCallbackList) {
  if (!room) {
    console.warn("Register Messages -> Room is null");
    throw new Error("Register Messages -> Room is null");
  }
  room.removeAllListeners();
  messageCallbackList?.forEach((mcObject) => {
    const { name, callback } = mcObject;
    if (!name || !callback) throw Error("Invalid message name/callback");
    room.onMessage(name, (message) => callback(room, message));
  });
}

function SendChatMessage(room, message) {
  if (!room) throw new Error("Send Chat Message -> Room is null");
  room.send("chat-message", message);
}

export { JoinRoom, LeaveRoom, CreateRoom, RegisterMessages, SendChatMessage };
