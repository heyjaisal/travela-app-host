import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../redux/slice/chat";
import authReducer from "../redux/slice/auth";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
});