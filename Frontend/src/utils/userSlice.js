import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: ""
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // addToken: (state, action) => {
    //   state.token = action.payload;
    // },
    addUser: (state, action) => {
      state.user = action.payload;
    },
    // removeToken: (state, action) => {
    //   state.token = "";
    // },
    removeUser: (state, action) => {
      state.user = "";
    },
  },
});

export const { addUser, removeUser } = userSlice.actions

export default userSlice.reducer;