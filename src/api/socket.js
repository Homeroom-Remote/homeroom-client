const events = {
  join_room_event: "join-room",
  user_connected_event: "user-connected",
  user_disconnected_event: "user-disconnected",
};

const joinRoom = (socket, roomID, userID) =>
  socket &&
  roomID &&
  userID &&
  socket.emit(events["join_room_event"], roomID, userID);

const onNewUserInRoom = (socket, callback) =>
  socket && callback && socket.on(events["user_connected_event"], callback);

const onUserLeaveRoom = (socket, callback) =>
  socket && callback && socket.on(events["user_disconnected_event"], callback);

const socketHandler = { joinRoom, onNewUserInRoom, onUserLeaveRoom };

export default socketHandler;
