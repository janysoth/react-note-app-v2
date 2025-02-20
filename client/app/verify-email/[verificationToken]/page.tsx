"use client";
import React, { useEffect, useState } from "react";

import { useUserContext } from "@/context/userContext";

interface Props {
  params: Promise<{
    verificationToken: string;
  }>;
}

function Page({ params }: Props) {
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const { verifyUser } = useUserContext();

  useEffect(() => {
    // Unwrap the params Promise (for future-proofing)
    (async () => {
      const { verificationToken } = await params;
      setVerificationToken(verificationToken);
    })();
  }, [params]);

  if (!verificationToken) {
    // Show a loading state while verificationToken is being resolved
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-page flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg flex flex-col justify-center items-center gap-6 px-8 py-6 rounded-md">
        <h1 className="text-blue-600 text-2xl font-bold">Verify Your Account</h1>

        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition"
          onClick={() => verifyUser(verificationToken)}
        >
          Verify Account
        </button>
      </div>
    </div>
  );
}

export default Page;