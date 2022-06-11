import create from "zustand";

const useStore = create((set) => ({
  askBeforeVideo: false,
  askBeforeAudio: false,
  autoCopyLink: false,
  showConnectionTime: false,
  playJoinSound: true,
  togglePlayJoinSound: () =>
    set((state) => ({ ...state, playJoinSound: !state.playJoinSound })),
  toggleAskBeforeVideo: () =>
    set((state) => ({ ...state, askBeforeVideo: !state.askBeforeVideo })),
  toggleAskBeforeAudio: () =>
    set((state) => ({ ...state, askBeforeAudio: !state.askBeforeAudio })),
  toggleAutoCopyLink: () =>
    set((state) => ({ ...state, autoCopyLink: !state.autoCopyLink })),
  toggleShowConnectionTime: () =>
    set((state) => ({
      ...state,
      showConnectionTime: !state.showConnectionTime,
    })),
}));

export default useStore;
