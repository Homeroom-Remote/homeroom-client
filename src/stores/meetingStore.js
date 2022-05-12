import create from "zustand";

const useStore = create((set) => ({
  isInMeeting: false,
  meetingID: null,
  owner: null,
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
