import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../interceptor/interceptor.js";

const getAccountBalance = createAsyncThunk(
  "accountThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/binance-api-router/account-router/get-account-balance"
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const getFutureAvailableBalance = createAsyncThunk(
  "futureAvailabeBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/binance-api-router/account-router/get-futures-account"
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export { getAccountBalance, getFutureAvailableBalance };
