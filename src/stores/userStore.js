import create from "zustand";

const useStore = create((set, get) => ({
  user: null,
  isLoggedIn: () => !!get().user,
  setUser: (user) =>
    set((state) => ({
      ...state,
      user: user,
    })),
}));

export default useStore;
