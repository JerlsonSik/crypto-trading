import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { logout } from "../store/authSlice/authSlice";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Funding Rates Arbitrage Bot
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {!isLoggedIn ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/order">
                Order
              </Button>
              <Button color="inherit" component={Link} to="/test">
                Test
              </Button>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
