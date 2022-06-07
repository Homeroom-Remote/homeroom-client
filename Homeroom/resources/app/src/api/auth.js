import {
  signInWithGoogle,
  signInAnonymously,
  auth,
} from "../firebase/firebase";

const onAuthStateChanged = (callback) => auth.onAuthStateChanged(callback);
const logout = (callback, error) => auth.signOut().then(callback).catch(error);
const getToken = async () => await auth.currentUser.getIdToken();

export {
  signInWithGoogle,
  signInAnonymously,
  onAuthStateChanged,
  logout,
  getToken,
};
