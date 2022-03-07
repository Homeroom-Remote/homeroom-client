import create from "zustand";

const useStore = create((set) => ({
  isInMeeting: false,
  requestCloseMeeting: () => {
    // set firebase meeting to 'offline'
    set((state) => (state.isInMeeting = true));
  },
  requestOpenMeeting: () => {
    // Check if user has a meeting object in firebase
    // If he doesn't have meeting object in firebase: Open meeting object in firebase
    // set firebase meeting to 'online'
    set((state) => (state.isInMeeting = true));
  },
  toggleIsInMeeting: () => {
    set((state) => (state.isInMeeting = !state.isInMeeting));
  },
}));

export default useStore;
