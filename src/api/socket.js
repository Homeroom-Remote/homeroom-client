const events = {
  join_room_event: "join-room",
  user_connected_event: "user-connected",
  user_disconnected_event: "user-disconnected",
  ready_event: "ready",
  new_stream_event: "new-stream",
  new_message: "message",
};

const declareReady = (socket) => socket && socket.emit(events["ready_event"]);

const joinRoom = (socket, roomID, userID) =>
  socket &&
  roomID &&
  userID &&
  socket.emit(events["join_room_event"], roomID, userID);

const onNewUserInRoom = (socket, callback) =>
  socket && callback && socket.on(events["user_connected_event"], callback);

const onUserLeaveRoom = (socket, callback) =>
  socket && callback && socket.on(events["user_disconnected_event"], callback);

const onNewStream = (socket, callback) =>
  socket && callback && socket.on(events["new_stream_event"], callback);

const onMessage = (socket, callback) =>
  socket && callback && socket.on(events["new_message"], callback);

const newStream = (socket) => socket && socket.emit(events["new_stream_event"]);

const sendMessage = (socket, message) =>
  socket && socket.emit(events["new_message"], message);

const socketHandler = {
  joinRoom,
  declareReady,
  onNewUserInRoom,
  onUserLeaveRoom,
  onNewStream,
  onMessage,
  newStream,
  sendMessage,
};

export default socketHandler;
