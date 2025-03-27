import { createSlice } from "@reduxjs/toolkit";
import {
  getAccountBalance,
  getFutureAvailableBalance,
} from "./accountThunk.js";

const accountSlice = createSlice({
  name: "accountSlice",
  initialState: {
    balances: [],
    availableUSDT: 0,
    futureAvailableBalance: 0,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccountBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload.balance;

        //Set availableUSDT
        const usdtAsset = action.payload.balance.find(
          (asset) => asset.asset === "USDT"
        );
        console.log(usdtAsset);

        if (usdtAsset) {
          state.availableUSDT = Math.floor(usdtAsset.free * 100) / 100;
        } else {
          state.availableUSDT = 0;
        }
      })
      .addCase(getAccountBalance.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccountBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getFutureAvailableBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.futureAvailableBalance =
          Math.floor(action.payload.availableBalance * 100) / 100;
      })
      .addCase(getFutureAvailableBalance.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFutureAvailableBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default accountSlice.reducer;
