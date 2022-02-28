import { useEffect } from "react";

import useTheme from "./stores/themeStore";
import useUser from "./stores/userStore";
import { onAuthStateChanged, logout } from "./api/auth";

import Welcome from "./components/Welcome";

function App() {
  const { theme } = useTheme();
  const { user, setUser, isLoggedIn } = useUser();
  useEffect(() => {
    onAuthStateChanged((authState) => {
      setUser(authState?.multiFactor?.user);
    });
  }, [setUser]);

  const handleLogout = () => {
    console.log(user);
    logout(
      () => console.log("Logged out succesfully"),
      () => console.warn("error logging out")
    );
  };

  console.log("logged in", isLoggedIn());
  if (isLoggedIn()) {
    return (
      <div className={theme}>
        <div className="w-screen h-screen bg-red-200">
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
