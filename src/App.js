import { useEffect, useState } from "react";

import useTheme from "./stores/themeStore";
import useUser from "./stores/userStore";
import { onAuthStateChanged } from "./api/auth";

import Welcome from "./components/Welcome/Welcome";
import Home from "./components/Home/Home";
import Meeting from "./components/Meeting/Meeting";
import { BallTriangle } from "./components/Spinners";
function App() {
  const { theme } = useTheme();
  const { setUser, isLoggedIn } = useUser();
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

  if (isLoggedIn()) {
    return (
      <div className={theme}>
        <Home />
        {/* <Meeting /> */}
      </div>
    );
  }
  return (
    <div className={theme}>
      <Welcome />
    </div>
  );
}

export default App;
