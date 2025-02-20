"use client"
import { useTasks } from '@/context/taskContext';
import { useUserContext } from '@/context/userContext';
import { overdueTasks } from '@/utils/utilities';
import Image from 'next/image';
import React from 'react';

const Profile = () => {
  const { user } = useUserContext();

  const { activeTasks, completedTasks, tasks, openProfileModal } = useTasks();

  const tasksOverdue = overdueTasks(tasks);

  return (
    <div className='m-3'>
      {/* Greeting */}
      <div
        className="px-2 py-4 flex items-center gap-3 bg-[#E6E6E6]/20 rounded-[0.8rem]
        hover:bg-[#E6E6E6]/50 transition duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-2 hover:border-white"
        onClick={openProfileModal}
      >
        {/* User Image */}
        <div>
          <Image
            src={user?.photo}
            alt="avatar"
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>

        {/* User Profile Name */}
        <div>
          <h1 className="flex flex-col text-xl">
            <span className="font-medium">Hello,</span>
            <span className="font-bold">{user?.name}</span>
          </h1>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6 flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-400">
            <p>Total Tasks:</p>

            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-purple-500 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {tasks.length}
              </span>
            </p>
          </div>

          {/* Active Tasks */}
          <div className="text-gray-400">
            <p>In Progress:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-[#3AAFAE] rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {activeTasks.length}
              </span>
            </p>
          </div>

          {/* Overdue Tasks */}
          <div className="text-gray-400">
            <p>Overdue Tasks:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-red-600 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {tasksOverdue.length}
              </span>
            </p>
          </div>

          {/* Complete Tasks */}
          <div className="text-gray-400">
            <p>Completed:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-green-400 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {completedTasks.length}
              </span>
            </p>
          </div>
        </div>
      </div>
      <h3 className="mt-5 font-medium">Activity</h3>
    </div>
  )
}

export default Profile