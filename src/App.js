import { useEffect, useState, useRef } from "react";

import useTheme from "./stores/themeStore";
import useUser from "./stores/userStore";
import useCall from "./api/useCall";
import { onAuthStateChanged, logout } from "./api/auth";

import Welcome from "./components/Welcome";
import { BallTriangle } from "./components/Spinners";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

function App() {
  const { theme } = useTheme();
  const { setUser, isLoggedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [videoStreams, setVideoStreams] = useState([]);
  const { peers, id, connectToNewUser, callError } = useCall();
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      connectToNewUser(remotePeerId, mediaStream);
    });
  };

  useEffect(() => {
    let streams = [];
    for (const userId of Object.keys(peers)) {
      if (peers[userId].video)
        streams.push({ id: userId, stream: peers[userId].video });
    }
    setVideoStreams(streams);
  }, [peers]);

  useEffect(() => {
    console.log("id:", id);
  }, [id]);
  useEffect(() => {
    onAuthStateChanged((authState) => {
      setLoading(true);
      setUser(authState?.multiFactor?.user);
      setTimeout(() => setLoading(false), 1000);
    });
  }, [setUser]);

  const handleLogout = () => {
    logout(
      () => console.log("Logged out succesfully"),
      () => console.warn("error logging out")
    );
  };

  const handleStreamCanPlay = (e) => {
    e.target.play();
  };

  if (loading) {
    return (
      <div className={theme}>
        <div className="flex h-screen w-full items-center justify-center">
          <BallTriangle />
        </div>
      </div>
    );
  }

  if (isLoggedIn()) {
    return (
      <div className={theme}>
        <div className="w-screen h-screen dark:bg-background-800 bg-background-100">
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
    );
  }
  return (
    <div className={theme}>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button
        className="w-24 h-24 bg-white"
        onClick={() => call(remotePeerIdValue)}
      >
        Call
      </button>
      {videoStreams.map((stream) => (
        <video
          key={`user-stream-${stream.id}`}
          ref={(video) => {
            if (video) video.srcObject = stream.stream;
          }}
          onCanPlay={handleStreamCanPlay}
        />
      ))}
      <Welcome />
    </div>
  );
}

export default App;
