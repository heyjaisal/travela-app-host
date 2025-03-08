import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slice/chat";
import authReducer from "./slice/auth";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
});