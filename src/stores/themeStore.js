import create from "zustand";

const useStore = create((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({
      ...state,
      theme: state.theme === "dark" ? "light" : "dark",
    })),
}));

export default useStore;
