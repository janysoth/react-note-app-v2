"use client"
import { FaGithub, FaMoon, FaUser } from "react-icons/fa"; // Example icons from react-icons

import { useTasks } from '@/context/taskContext';
import { useUserContext } from '@/context/userContext';
import React from 'react';
import IconLink from '../IconLink/IconLink';

const Header = () => {
  const { user } = useUserContext();
  const { name } = user;
  const userId = user._id;

  const { activeTasks, openModalForAdd } = useTasks();

  return (
    <header className="px-6 py-4 w-full flex flex-col sm:flex-row items-center justify-between bg-[#f9f9f9] shadow-md rounded-[1.5rem]">
      {/* Left Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-lg font-medium">
          <span role="img" aria-label="wave">👋 &nbsp;</span>
          {userId ? `Welcome, ${name}!` : "Welcome to Note App"}
        </h1>

        <p className="text-sm mt-1">
          {userId ? (
            <>
              You have {" "}
              <span className="font-bold text-[#3aafae]">{activeTasks.length}</span>
              {" "} active tasks.
            </>
          ) : (
            "Please login or register to view your tasks."
          )}
        </p>
      </div>

      {/* Right Section */}
      <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center sm:gap-8 w-full sm:w-auto">
        <button
          className="w-full sm:w-auto px-6 py-2 bg-[#3aafae] text-white rounded-full hover:bg-[#00A1F1] transition-all duration-200 ease-in-out text-sm sm:text-base"
          onClick={openModalForAdd}
        >
          {userId ? "Add a new Task" : "Login / Register"}
        </button>

        {/* Icon Links */}
        {userId && (<div className="flex gap-4 mt-4 sm:mt-0">
          <IconLink
            href="https://github.com/janysoth"
            icon={<FaGithub />}
          />

          <IconLink
            href="https://github.com/janysoth"
            icon={<FaMoon />}
          />

          <IconLink
            href="https://github.com/janysoth"
            icon={<FaUser />}
          />
        </div>)}
      </div>
    </header>
  );
}

export default Header;