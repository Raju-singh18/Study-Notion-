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
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="w-full bg-richblack-900 text-richblack-5">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
