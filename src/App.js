import useTheme from "./stores/themeStore";

import Welcome from "./components/Welcome";

function App() {
  const { theme } = useTheme();
  return (
    <div className={theme}>
      <Welcome />
    </div>
  );
}

export default App;
