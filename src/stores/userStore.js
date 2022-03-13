import create from "zustand";
import { v4 as uuid } from "uuid";

const useStore = create((set, get) => ({
  user: null,
  isLoggedIn: () => !!get().user,
  setUser: (user) => {
    if (!user) {
      set((state) => ({ ...state, user: null }));
      return;
    }
    // Given name for annoymous user
    user.displayName = user?.isAnonymous ? `bot-${uuid()}` : user?.displayName;
    set((state) => ({
      ...state,
      user: user,
    }));
  },
}));

export default useStore;
