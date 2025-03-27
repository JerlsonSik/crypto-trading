import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice/authThunk.js";
import { Navigate, useNavigate } from "react-router-dom";

const LoginPage = () => {
  // The username here is actually refer to eamil
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ username, password }));
    if(loginUser.fulfilled.match(result)){
      navigate('/dashboard')
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        fullWidth
        margin="normal"
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Box>
  );
};

export default LoginPage;
