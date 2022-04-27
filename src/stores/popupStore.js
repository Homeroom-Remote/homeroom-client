import create from "zustand";

const useStore = create((set) => ({
  show: false,
  opts: {},
  setShow: (newState) => {
    set((state) => (state.show = newState));
  },
  setOpts: (newOpts) => {
    set((state) => (state.opts = newOpts));
  },
}));

export default useStore;
