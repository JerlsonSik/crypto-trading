import { createAsyncThunk } from "@reduxjs/toolkit";


const API_BASE_URL = "http://localhost:3000/api/user"

const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, {rejectWithValue}) => {
    try{
      const response = await fetch(`${API_BASE_URL}/login/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: loginData.username, password: loginData.password})
      })

      if(!response.ok){
        const data = await response.json()
        throw new Error (data.message)
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.User))
      localStorage.setItem("token", data.Token)
      localStorage.setItem("isLoggedIn", "true");

      return {
        user: data.User,
        token: data.Token
      };
    
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const clearSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
};


const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!user || !token || !isLoggedIn) {
        clearSession()
        return rejectWithValue("You are not log in")
      }

      // await axiosInstance.get('/user/validateSession')

      return { user, token, isLoggedIn };

    } catch (error) {
      clearSession()
      return rejectWithValue('You are not log in');
    }
  }
)

export {
  loginUser,
  loadUserFromStorage
}