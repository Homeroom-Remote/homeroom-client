import { signInWithGoogle, auth } from "../firebase/firebase";
const onAuthStateChanged = (callback) => auth.onAuthStateChanged(callback);
const logout = (callback, error) => auth.signOut().then(callback).catch(error);

export { signInWithGoogle, onAuthStateChanged, logout };
