import { firebase, db, auth } from "../firebase/firebase";

const errors = {
  user_not_logged_in: "User is not logged in",
  not_last_person_error: "Not last person",
};

async function isLoggedIn() {
  const isLoggedInPromise = new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (user) {
      resolve(user);
    } else {
      reject(errors["user_not_logged_in"]);
    }
  });

  return isLoggedInPromise;
}

function getDoc(meeting_id) {
  return db.collection("meetings").doc(meeting_id);
}

async function get(meeting_id) {
  const getMeetingPromise = new Promise((resolve, reject) => {
    db.collection("meetings")
      .doc(meeting_id)
      .get()
      .then((snapshot) => resolve(snapshot.data()))
      .catch((error) => reject(error));
  });

  return getMeetingPromise;
}

async function getMyMeeting() {
  const getMyMeetingPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => {
        get(user.uid)
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });

  return getMyMeetingPromise;
}

async function create() {
  const createPromise = new Promise((resolve, reject) => {
    const user = auth.currentUser;

    if (user) {
      // User is logged in
      const meeting_id = user.uid;
      get(meeting_id)
        .then((document) => {
          if (!document) {
            // Create meeting
            db.collection("meetings")
              .doc(meeting_id)
              .set({
                owner: user.uid,
                status: "offline",
                participants: [],
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then((docRef) => resolve(get(meeting_id)))
              .catch((error) => reject(error));
          }
          // Meeting exists
          else if (document !== undefined) {
            resolve(document);
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(errors["user_not_logged_in"]);
    }
  });

  return createPromise;
}

async function updateStatus(status) {
  const updateMeetingDocumentPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) =>
        getDoc(user.uid).update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          status: status,
        })
      )
      .catch((error) => reject(error));
  });

  return updateMeetingDocumentPromise;
}

async function openMeeting() {
  return updateStatus("online");
}

async function closeMeeting() {
  return updateStatus("offline");
}

async function isOnline(meeting_id) {
  const isOnlinePromise = new Promise((resolve, reject) => {
    get(meeting_id)
      .then((meeting) => resolve(meeting.status === "online"))
      .catch((error) => reject(error));
  });

  return isOnlinePromise;
}

async function isMyMeetingOnline() {
  const isMyMeetingOnlinePromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => isOnline(user.uid))
      .then((answer) => resolve(answer))
      .catch((error) => reject(error));
  });

  return isMyMeetingOnlinePromise;
}

async function getMyMeetingId() {
  const getMyMeetingIdPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => resolve(user.uid))
      .catch((error) => reject(error));
  });
  return getMyMeetingIdPromise;
}

async function closeMeetingIfLastPerson() {
  const closeMeetingIfLastPersonPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => get(user.uid))
      .then((meeting) => {
        console.log(meeting);
        if (meeting.participants.length === 0) return closeMeeting();
        reject(errors["not_last_person_error"]);
      })
      .then()
      .catch((error) => reject(error));
  });
  return closeMeetingIfLastPersonPromise;
}

export {
  create,
  openMeeting,
  closeMeeting,
  get,
  getMyMeeting,
  isOnline,
  isMyMeetingOnline,
  getMyMeetingId,
  closeMeetingIfLastPerson,
};
