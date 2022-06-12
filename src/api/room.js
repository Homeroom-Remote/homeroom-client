import * as Colyseus from "colyseus.js";

const wsURL = `ws://homeroom-server.herokuapp.com/:3030`;
// const wsURL = `ws://${window.location.hostname}:3030`;

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
    return;
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

function SendSurveyForm(room, question, surveyTime) {
  if (!room) throw new Error("Send Survey -> Room is null");
  room.send("survey-form", { question: question, surveyTime: surveyTime });
}

function SendSurveyAnswer(room, answer) {
  if (!room) throw new Error("Send Survey -> Room is null");
  room.send("survey-answer", answer);
}

function SendHandGesture(room, prediction) {
  if (!room) throw new Error("Send Hand Gesture -> Room is null");
  room.send("hand-gesture", prediction);
}

function SendConcentrationPrediction(room, prediction) {
  if (!room) throw new Error("Send Concentration Prediction -> Room is null");
  room.send("concentration", prediction);
}

function SendExpressionsPrediction(room, prediction) {
  if (!room) throw new Error("Send Expressions Prediction -> Room is null");
  room.send("expressions", prediction);
}

function RegisterToMessageQueue(room) {
  room.send("add-to-question-queue", {});
}

function RemoveFromMessageQueue(room, id = null) {
  room.send("remove-from-question-queue", { id: id });
}

function GetOwner(room) {
  room.send("get-owner", {});
}

function GetQuestionQueue(room) {
  room.send("get-question-queue");
}

function StartScreenShare(room, mediaSteamId) {
  room.send("share-screen", { event: "start", streamId: mediaSteamId });
}

function StopScreenShare(room) {
  room.send("share-screen", { event: "stop" });
}

function GetChat(room) {
  room.send("get-chat", {});
}

export {
  JoinRoom,
  LeaveRoom,
  CreateRoom,
  RegisterMessages,
  SendChatMessage,
  SendHandGesture,
  SendConcentrationPrediction,
  SendExpressionsPrediction,
  RegisterToMessageQueue,
  RemoveFromMessageQueue,
  GetOwner,
  GetQuestionQueue,
  GetChat,
  StartScreenShare,
  StopScreenShare,
  SendSurveyForm,
  SendSurveyAnswer,
};
