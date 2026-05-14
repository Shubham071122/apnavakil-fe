import { create } from "zustand";

interface Message {
  role: "USER" | "ASSISTANT";
  content: string;
  fullLegalText?: string;
  audio?: Blob;
}

interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  addMessage: (msg: Message) => void;
  setProcessing: (status: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isProcessing: false,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setProcessing: (status) => set({ isProcessing: status }),
}));
