import create from "zustand";

const useStore = create((set) => ({
  generalChat: [],
  privateChat: [],
  unreadGeneralChatMessages: 0,
  unreadPrivateChatMessages: 0,
  addGeneralMessage: (message) =>
    set((state) => {
      state.generalChat = [...state.generalChat, message];
      state.unreadGeneralChatMessages += 1;
    }),
  addPrivateMessage: (message) =>
    set((state) => {
      state.privateChat = [...state.privateChat, message];
      state.unreadPrivateChatMessages += 1;
    }),
  onOpenGeneralChat: () =>
    set((state) => (state.unreadGeneralChatMessages = 0)),
  onOpenPrivateChat: () =>
    set((state) => (state.unreadPrivateChatMessages = 0)),
}));

export default useStore;
