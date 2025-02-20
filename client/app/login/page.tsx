"use client";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user?._id) {
      router.push("/");
    }
  }, [user, router]);

  if (user?._id) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="auth-page w-full h-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default LoginPage;