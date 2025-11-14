import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { CircleLoader } from "react-spinners";
import Sidebar from "../components/core/Dashboard/Sidebar";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircleLoader color="#facc15" size={80} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-richblack-900 text-richblack-5 pt-[3.5rem]">
      {/* Sidebar - static below navbar */}
      <Sidebar />

      {/* Main Content - scrollable */}
      <div className="flex-1 overflow-auto h-[calc(100vh-3.5rem)] px-6 lg:px-12">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
