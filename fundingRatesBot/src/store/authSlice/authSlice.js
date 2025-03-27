import { createSlice } from "@reduxjs/toolkit";
import { loginUser, loadUserFromStorage } from "./authThunk.js";

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: true,
  error: null
}

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    logout(state){
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.error = action.payload;
        state.loading = false;
      });
  }
})

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer
