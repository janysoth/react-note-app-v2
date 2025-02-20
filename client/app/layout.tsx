"use client"
import { metadata } from "@/app/metadata";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { useUserContext } from "@/context/userContext";
import MainContentLayout from "@/providers/MainContentLayout";
import MainLayout from "@/providers/MainLayout";
import SidebarProvider from "@/providers/SidebarProvider";
import UserProvider from "@/providers/UserProvider";
import Header from "./components/Header/Header";
import MiniSidebar from "./components/MiniSidebar/MiniSidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="title" content={metadata.title} />
        <title>{metadata.title}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <LayoutContent>{children}</LayoutContent>
        </UserProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { userLoginStatus } = useUserContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await userLoginStatus();
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, [userLoginStatus]);

  if (!isLoggedIn) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="h-full flex overflow-hidden">
        <MiniSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <MainContentLayout>
            <MainLayout>{children}</MainLayout>
            <SidebarProvider />
          </MainContentLayout>
        </div>
      </div>
    </>
  );
}