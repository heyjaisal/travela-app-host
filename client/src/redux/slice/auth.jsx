import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = undefined; 
    },
  },
});

export const { setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;