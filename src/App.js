import { useEffect, useState } from "react";

import useTheme from "./stores/themeStore";
import useUser from "./stores/userStore";
import useMeeting from "./stores/meetingStore";
import usePopup from "./stores/popupStore";
import { onAuthStateChanged } from "./api/auth";

import Welcome from "./components/Welcome/Welcome";
import Home from "./components/Home/Home";
import Meeting from "./components/Meeting/Meeting";
import { BallTriangle } from "./components/Spinners";
import PopupOverlay from "./components/PopupOverlay";
function App() {
  const { theme } = useTheme();
  const { setUser, isLoggedIn } = useUser();
  const { isInMeeting } = useMeeting();
  const { show, setShow, opts } = usePopup();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged((authState) => {
      setLoading(true);
      setUser(authState?.multiFactor?.user);
      setTimeout(() => setLoading(false), 1000);
    });
  }, [setUser]);

  if (loading) {
    return (
      <div className={theme}>
        <div className="flex h-screen w-full items-center justify-center">
          <BallTriangle />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) {
    return (
      <div className={theme}>
        <Welcome />
      </div>
    );
  }

  if (isInMeeting) {
    return (
      <div className={theme}>
        <Meeting />
      </div>
    );
  }

  return (
    <div className={theme}>
      <PopupOverlay {...opts} show={show} setShow={setShow} />
      <Home />
      {/* <Meeting /> */}
    </div>
  );
}

export default App;
