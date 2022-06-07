import create from "zustand";

const useStore = create((set) => ({
  isInMeeting: false,
  meetingID: null,
  owner: null,
  screenSharer: null,
  setScreenSharer: (sharer) => {
    set((state) => (state.screenSharer = sharer));
  },
  setOwner: (owner) => {
    set((state) => (state.owner = owner));
  },
  setMeetingID: (meetingID) => {
    set((state) => (state.meetingID = meetingID));
  },
  exitMeeting: () => {
    set((state) => {
      state.isInMeeting = false;
      state.meetingID = null;
      state.owner = null;
    });
  },
  joinMeeting: (meetingID) => {
    set((state) => {
      state.isInMeeting = true;
      state.meetingID = meetingID;
    });
  },
}));

export default useStore;
