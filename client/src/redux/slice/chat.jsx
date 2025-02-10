import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedchatMessages: [],
  directMessageContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedchatMessages = action.payload;
    },
    closeChat: (state) => {
      state.selectedChatType = undefined;
      state.selectedChatData = undefined;
      state.selectedchatMessages = [];
    },
    setDirectMessageContacts: (state, action) => {
      state.directMessageContacts = action.payload;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setFileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      state.selectedchatMessages.push({
        ...message,
        recipient: message.recipient._id,
        sender: message.sender._id,
      });
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  closeChat,
  setDirectMessageContacts,
  setIsUploading,
  setIsDownloading,
  setFileUploadProgress,
  setFileDownloadProgress,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
