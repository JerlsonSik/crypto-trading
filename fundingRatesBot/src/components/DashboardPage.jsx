import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountStatus from "./AccountStatus";
const DashboardPage = () => {
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigate("/login");
    }
  }, [authState.isLoggedIn, navigate]);

  if (!authState.user) {
    return null; // or a loading spinner
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {authState.user.username}!
      </h1>
      <div className="mt-4">
        <p>Email: {authState.user.email}</p>
        {/* Add more user information as needed */}
      </div>
      <div>
        <Suspense fallback={<div>Loading Account Details</div>}>
          <AccountStatus />
        </Suspense>
      </div>
      <p>dfsaf</p>
    </div>
  );
};

export default DashboardPage;
