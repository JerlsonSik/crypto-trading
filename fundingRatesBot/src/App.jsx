import "./App.css";
import LoginPage from "./components/LoginPage.jsx";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUserFromStorage } from "./store/authSlice/authThunk.js";
import DashboardPage from "./components/DashboardPage.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import Test from "./components/Test.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Order from "./components/Order.jsx";

// Root Redirect will go to dashboard, but run useEffect first, if Use Effect is not expire, then will go to login

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
