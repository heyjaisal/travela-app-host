import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversation: null,
  messagesByConversation: {}, 
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;

      const convId = action.payload._id;
      if (!state.messagesByConversation[convId]) {
        state.messagesByConversation[convId] = {
          messages: [],
          hasMore: true,
          page: 1,
        };
      }
    },

    initializeConversationMessages: (state, action) => {
      const { conversationId } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = {
          messages: [],
          hasMore: true,
          page: 1,
        };
      }
    },

    addMessage: (state, action) => {
      const msg = action.payload;
      const convId = msg.conversationId;
      if (!state.messagesByConversation[convId]) {
        state.messagesByConversation[convId] = {
          messages: [],
          hasMore: true,
          page: 1,
        };
      }
      state.messagesByConversation[convId].messages.push(msg); // Add new message at the bottom
    },

    prependMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      const data = state.messagesByConversation[conversationId];

      if (!data) {
        state.messagesByConversation[conversationId] = {
          messages: [...messages],
          hasMore: true,
          page: 2,
        };
      } else {
        data.messages.push(...messages);
      }
    },

    setHasMore: (state, action) => {
      const { conversationId, hasMore } = action.payload;
      if (state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId].hasMore = hasMore;
      }
    },

    resetChatState: () => initialState,
  },
});

export const {
  setConversations,
  selectConversation,
  initializeConversationMessages,
  addMessage,
  prependMessages,
  setHasMore,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
