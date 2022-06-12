import create from "zustand";

const useStore = create((set, get) => ({
  isInMeeting: false,
  meetingID: null,
  owner: null,
  screenSharer: null,
  peers: [],
  setPeers: (peers) => {
    set((state) => (state.peers = peers));
  },
  addPeer: (peer) => {
    set((state) => (state.peers = [...state.peers, peer]));
  },
  getPeers: () => {
    return get().peers;
  },
  getPeerById: (id) => {
    return get().peers.find((p) => p.id === id);
  },
  removePeerById: (id) => {
    set((state) => (state.peers = [...state.peers.filter((p) => p.id !== id)]));
  },
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
      state.peers = [];
    });
  },
  joinMeeting: (meetingID) => {
    set((state) => {
      state.peers = [];
      state.isInMeeting = true;
      state.meetingID = meetingID;
    });
  },
}));

export default useStore;
