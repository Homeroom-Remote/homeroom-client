import { firebase, db, auth } from "../firebase/firebase";

const errors = {
  user_not_logged_in: "User is not logged in",
  not_last_person_error: "Not last person",
  meeting_not_online_error: "Meeting is not online",
  no_meeting_error: "No meeting was found",
};

const USERS_COLLECTION = "users";
const MEETINGS_COLLECTION = "meetings";

function getMeetingFromUserID(uid) {
  return uid.slice(0, 6);
}
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
  return db.collection(MEETINGS_COLLECTION).doc(meeting_id);
}

async function get(meeting_id) {
  const getMeetingPromise = new Promise((resolve, reject) => {
    db.collection(MEETINGS_COLLECTION)
      .doc(meeting_id)
      .get()
      .then((snapshot) => resolve(snapshot.data()))
      .catch((error) => reject(error));
  });

  return getMeetingPromise;
}

async function getParticipants(id) {
  const meeting = await get(id);
  return meeting?.participants;
}

async function getMyMeeting() {
  const getMyMeetingPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => {
        get(getMeetingFromUserID(user.uid))
          .then((meeting) => {
            if (meeting) resolve(meeting);
            else reject(errors["no_meeting_error"]);
          })
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
      const meeting_id = getMeetingFromUserID(user.uid);
      get(meeting_id)
        .then((document) => {
          if (!document) {
            // Create meeting
            db.collection(MEETINGS_COLLECTION)
              .doc(meeting_id)
              .set({
                owner_id: user.uid,
                owner_name: user.displayName,
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
      .then((user) => {
        getDoc(getMeetingFromUserID(user.uid)).update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          status: status,
        });
        resolve(true);
      })
      .catch((error) => reject(error));
  });

  return updateMeetingDocumentPromise;
}
async function openMeeting() {
  const openMeetingPromise = new Promise((resolve, reject) => {
    updateStatus("online")
      .then(() => {
        addMeToMeetingParticipants();
      })
      .then(() => resolve(true))
      .catch((error) => reject(error));
  });
  return openMeetingPromise;
}

async function closeMeeting() {
  const closeMeetingPromise = new Promise((resolve, reject) => {
    updateStatus("offline")
      .then(() => {
        clearParticipants();
      })
      .then(() => resolve(true))
      .catch((error) => reject(error));
  });
  return closeMeetingPromise;
}

async function clearParticipants() {
  const clearParticipantsPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) =>
        getDoc(getMeetingFromUserID(user.uid)).update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          participants: [],
        })
      )
      .catch((error) => reject(error));
  });

  return clearParticipantsPromise;
}

async function isOnline(meeting_id) {
  const isOnlinePromise = new Promise((resolve, reject) => {
    get(meeting_id)
      .then((meeting) => {
        if (meeting) resolve(meeting.status === "online");
        reject(errors["no_meeting_error"]);
      })
      .catch((error) => reject(error));
  });

  return isOnlinePromise;
}

async function isMyMeetingOnline() {
  const isMyMeetingOnlinePromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => isOnline(getMeetingFromUserID(user.uid)))
      .then((answer) => resolve(answer))
      .catch((error) => reject(error));
  });

  return isMyMeetingOnlinePromise;
}

async function getMyMeetingId() {
  const getMyMeetingIdPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => resolve(getMeetingFromUserID(user.uid)))
      .catch((error) => reject(error));
  });
  return getMyMeetingIdPromise;
}

async function closeMeetingIfLastPerson() {
  console.trace();
  const closeMeetingIfLastPersonPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => get(getMeetingFromUserID(user.uid)))
      .then((meeting) => {
        if (
          // Meeting is empty completely
          meeting.participants.length === 0 ||
          // Meeting has 1 participant (the owner and he is exiting so close it)
          (meeting.participants.find((id) => id === meeting.owner_id) &&
            meeting.participants.length === 1)
        )
          return closeMeeting();
        reject(errors["not_last_person_error"]);
      })
      .then()
      .catch((error) => reject(error));
  });
  return closeMeetingIfLastPersonPromise;
}

async function addMeToMeetingParticipants() {
  const addMeToMeetingParticipantsPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => {
        return addToMeetingParticipants(user.uid);
      })
      .catch((error) => reject(error));
  });

  return addMeToMeetingParticipantsPromise;
}

async function addToMeetingParticipants(uid) {
  if (!uid) return;

  const addToMeetingParticipantsPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) =>
        getDoc(getMeetingFromUserID(user.uid)).update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          participants: firebase.firestore.FieldValue.arrayUnion(uid),
        })
      )
      .catch((error) => reject(error));
  });
  return addToMeetingParticipantsPromise;
}

async function getMeetingHistory() {
  const getMeetingHistoryPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => db.collection(USERS_COLLECTION).doc(user.uid).get())
      .then((snapshot) => snapshot.data())
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });

  return getMeetingHistoryPromise;
}

async function isMeetingInFavorite(meeting_id) {
  const getMeetingHistoryPromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => db.collection(USERS_COLLECTION).doc(user.uid).get())
      .then((snapshot) => snapshot.data())
      .then((data) => {
        const array = data.meeting_favorite
        const isInFavoriteArray = array.filter(
          (meet) => meet.id === meeting_id
        );
        if (isInFavoriteArray === undefined || isInFavoriteArray.length == 0) {
          resolve(true)
        }
        else {
          resolve(false)
        }
      })
      .catch((e) => resolve(true));
  });

  return getMeetingHistoryPromise;
}


async function handleRemoveFromFavorite(meeting) {
  isLoggedIn()
    .then((user) => {
      db.collection(USERS_COLLECTION)
        .doc(user.uid)
        .update({
          "meeting_favorite": firebase.firestore.FieldValue.arrayRemove({ "at": meeting.at, "id": meeting.id })
        });
    });
}


async function handleAddToFavorite(meeting) {
  console.log("handleAddToFavorite")
  console.log(meeting)
  isLoggedIn()
    .then((user) => {
      db.collection(USERS_COLLECTION)
        .doc(user.uid)
        .set({
          meeting_favorite: firebase.firestore.FieldValue.arrayUnion({
            id: meeting.id,
            at: meeting.created_at,
          }),
        }, { merge: true });
    });
}

async function getMeetingFavorite() {
  const getMeetingFavoritePromise = new Promise((resolve, reject) => {
    isLoggedIn()
      .then((user) => db.collection(USERS_COLLECTION).doc(user.uid).get())
      .then((snapshot) => snapshot.data())
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });

  return getMeetingFavoritePromise;
}
export {
  create,
  openMeeting,
  closeMeeting,
  get,
  getMyMeeting,
  getParticipants,
  isOnline,
  isMyMeetingOnline,
  getMyMeetingId,
  closeMeetingIfLastPerson,
  getMeetingHistory,
  getMeetingFavorite,
  getMeetingFromUserID,
  handleAddToFavorite,
  isMeetingInFavorite,
  handleRemoveFromFavorite,
};
