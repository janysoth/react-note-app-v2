"use client"

import Sidebar from '@/app/components/Sidebar/Sidebar';
import { useUserContext } from '@/context/userContext';
import React from 'react';

const SidebarProvider = () => {
  const userId = useUserContext().user._id;

  return (
    <>
      {userId && <Sidebar />}
    </>
  )
}

export default SidebarProvider