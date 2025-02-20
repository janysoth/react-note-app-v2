"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import IconCheck from "@/public/icons/IconCheck";
import IconDeleteAll from "@/public/icons/IconDeleteAll";
import IconFileCheck from "@/public/icons/IconFileCheck";
import IconGrid from "@/public/icons/IconGrid";
import IconStopwatch from "@/public/icons/IconStopwatch";
import { logout } from "@/utils/Icons";
import Link from "next/link";
import Tooltip from "../Tooltip/Tooltip";

const MiniSidebar = () => {

  const { logoutUser, user } = useUserContext();

  const { tasks, deleteAllTasks } = useTasks();

  const userId = user?._id;

  const router = useRouter();

  const handleLogout = () => {
    logoutUser();

    setTimeout(() => {
      window.location.reload()
    }, 500)
  };
  /** *
   * const { deleteAllTasks } = useTasks()
   * 
   * use this function in the deleteAllTasks button
  */
  const pathname = usePathname();

  const getStrokeColor = (link: string) => {
    return pathname === link ? "#3aafae" : "#71717a";
  };

  const navItems = [
    { title: "All", link: "/", Icon: IconGrid },
    { title: "Completed", link: "/completed", Icon: IconFileCheck },
    { title: "Pending", link: "/pending", Icon: IconCheck },
    { title: "Overdue", link: "/overdue", Icon: IconStopwatch },
  ];

  return (
    <div className="basis-[5rem] flex flex-col bg-[url('/flurry.png')] bg-cover bg-repeat">
      {/* Logo */}
      <div className="flex items-center justify-center h-[5rem]">
        <Link href="/">
          <Image src="/logo.png" width={28} height={28} alt="logo" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex-1 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-10">
          {navItems.map(({ title, link, Icon }, index) => (
            <li key={index} className="relative group hover:text-red-500">
              <Link href={link}>
                <Icon strokeColor={getStrokeColor(link)} />
              </Link>
              <Tooltip text={title} />
            </li>
          ))}
        </ul>

        <div className="mb-[1.5rem] flex flex-col gap-2">
          {/* Logout Button with Tooltip */}
          {userId && (
            <div className="relative group">
              <button
                className="w-12 h-12 flex justify-center items-center border-2 border-[#EB4E31] p-2 rounded-full hover:text-white hover:bg-red-500"
                onClick={handleLogout}
              >
                {logout}
              </button>

              {/* Hover Tooltip */}
              <Tooltip text="Logout" />
            </div>
          )}

          {/* Delete All Button with Tooltip */}
          {(tasks.length > 0) && (<div className="relative group">
            <button
              className="w-12 h-12 flex justify-center items-center border-2 border-[#EB4E31] p-2 rounded-full"
              onClick={deleteAllTasks}
            >
              <IconDeleteAll strokeColor="#EB4E31" />
            </button>

            {/* Hover Tooltip */}
            <Tooltip text="Delete All Task" />
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default MiniSidebar;