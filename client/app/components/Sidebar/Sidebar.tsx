import { useUserContext } from "@/context/userContext";
import React from "react";
import Profile from "../Profile/Profile";
import RadialChart from "../RadialChart/RadialChart";

function Sidebar() {
  const { logoutUser } = useUserContext();

  const handleLogout = () => {
    logoutUser();

    // Force page reload after logout
    setTimeout(() => {
      window.location.reload();
    }, 500); // Delay to ensure logout completes before reloading
  };

  return (
    <div className="w-[20rem] mt-[5.3rem] h-[calc(100%-5rem)] fixed right-0 top-0 bg-[#f9f9f9] flex flex-col rounded-[1.5rem]s">
      <Profile />
      <div className="mx-4">
        <RadialChart />
      </div>

      <button
        className="mt-auto mb-4 mx-6 py-4 px-8 bg-[#EB4E31] text-white rounded-[50px] hover:bg-[#3aafae] transition duration-200 ease-in-out"
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Sidebar;
