import create from "zustand";

const useStore = create((set) => ({
  defaultVideo: true,
  defaultAudio: false,
  toggleVideo: () =>
    set((state) => ({ ...state, defaultVideo: !state.defaultVideo })),
  toggleAudio: () =>
    set((state) => ({ ...state, defaultAudio: !state.defaultAudio })),
}));

export default useStore;
