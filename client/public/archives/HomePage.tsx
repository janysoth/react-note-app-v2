/** client -> app -> page.tsx - old file**/

"use client";

import ChangePasswordForm from "@/app/components/auth/ChangePasswordForm";
import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { useState } from "react";

export default function Home() {
  useRedirect("/login");

  const {
    logoutUser,
    user,
    handleUserInput,
    userState,
    updateUser,
    emailVerification,
    allUsers,
    deleteUser,
  } = useUserContext();
  const { name, photo, isVerified, bio } = user;

  const [isOpen, setIsOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const toggleBio = () => {
    setIsOpen(!isOpen);
  };

  const togglePassword = () => {
    setPasswordModal(!passwordModal);
  };

  return (
    <main className="py-8 px-4 sm:px-8 md:px-16">
      <header className="flex flex-col md:flex-row md:justify-between items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
          Welcome <span className="text-red-600">{name}</span>
        </h1>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-4">
            <img
              src={photo}
              alt={name}
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                togglePassword();
                setIsOpen(false)
              }}
            />

            {!isVerified && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm md:text-base"
                onClick={emailVerification}
              >
                Verify Account
              </button>
            )}

            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm md:text-base"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <p className="text-gray-600 text-lg md:text-xl text-center md:text-left">{bio}</p>

        <div className="mt-6">
          <button
            onClick={() => {
              toggleBio();
              setPasswordModal(false)
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md text-sm md:text-base"
          >
            Update Bio
          </button>
        </div>

        {isOpen && (
          <form className="mt-4 px-8 py-4 max-w-[520px] w-full rounded-md">
            <div className="flex flex-col">
              <label htmlFor="bio" className="mb-1 text-[#999]">
                Bio
              </label>

              <textarea
                name="bio"
                defaultValue={bio}
                className="px-4 py-3 border-2 rounded-md outline-green-500 text-gray-800 text-sm"
                onChange={(e) => handleUserInput("bio")(e)}
              />
            </div>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                updateUser(e, { bio: userState.bio });
                toggleBio();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm md:text-base"
            >
              Submit
            </button>
          </form>
        )}
      </section>

      {/* Password Modal Section */}
      {passwordModal && (
        <section className="mt-8 flex justify-center">
          <div className="mt-4 justify-end">
            <div className="flex-1">
              <ChangePasswordForm
                onSubmitSuccess={() => setPasswordModal(false)}
              />
            </div>
          </div>
        </section>
      )}

      <div className="">
        <div className="flex-1 mt-4 flex gap-8">
          {user.role === "admin" && (
            <ul>
              {allUsers.map(
                (user: any, i: number) =>
                  user.role !== "admin" && (
                    <li
                      key={i}
                      className="mb-2 px-2 py-3 border grid grid-cols-4 items-center gap-8 rounded-md"
                    >
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-[40px] h-[40px] rounded-full"
                      />

                      <p>{user.name}</p>
                      <p>{user.bio}</p>

                      <button
                        className="bg-red-500 text-white p-2 rounded-md"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete User
                      </button>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}