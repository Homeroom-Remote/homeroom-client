import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB9GiII0wNBf-QokH04cQvMmMQO1VXpY5E",
  authDomain: "homeroom-fd52a.firebaseapp.com",
  projectId: "homeroom-fd52a",
  storageBucket: "homeroom-fd52a.appspot.com",
  messagingSenderId: "41043520356",
  appId: "1:41043520356:web:6e0f118d1974d72302e871",
  measurementId: "G-30QJ7BQJVX",
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = (callback) =>
  auth.signInWithPopup(provider).then(callback);

export { firebase, app, analytics, auth, signInWithGoogle, db };
export default firebase;
