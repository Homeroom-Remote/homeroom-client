import create from "zustand";

const useStore = create((set, get) => ({
  theme: "dark",
  getBgFromTheme: () => (get().theme === "dark" ? "#262626" : "#cbd5e1"),
  getTextFromTheme: () => (get().theme === "dark" ? "white" : "black"),
  toggleTheme: () =>
    set((state) => ({
      ...state,
      theme: state.theme === "dark" ? "light" : "dark",
    })),
}));

export default useStore;
