import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice/authSlice";
import accountReducer from "../store/accountSlice/accountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
  },
});
