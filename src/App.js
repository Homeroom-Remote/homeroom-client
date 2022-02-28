import { useEffect, useState } from "react";

import useTheme from "./stores/themeStore";
import useUser from "./stores/userStore";
import { onAuthStateChanged, logout } from "./api/auth";

import Welcome from "./components/Welcome";
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

  const handleLogout = () => {
    logout(
      () => console.log("Logged out succesfully"),
      () => console.warn("error logging out")
    );
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
      <Welcome />
    </div>
  );
}

export default App;
