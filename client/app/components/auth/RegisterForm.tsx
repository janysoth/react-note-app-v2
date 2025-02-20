"use client"
import { useUserContext } from '@/context/userContext';
import React, { useState } from 'react';

const RegisterForm = () => {
  const { registerUser, userState, handleUserInput } = useUserContext();
  const { name, email, password } = userState;
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <form className='relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]'>
      <div className="relative z-10">
        <h1 className='mb-2 text-center text-[1.35rem] font-medium'>
          Register for an Account
        </h1>

        {/* Full Name */}
        <div className="flex flex-col">
          <label htmlFor='name' className='mb-1 text-[#999]'>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => handleUserInput("name")(e)}
            name="name"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col mt-[1rem]">
          <label htmlFor='email' className='mb-1 text-[#999]'>
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => handleUserInput("email")(e)}
            name="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="johndoe@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col mt-[1rem] relative">
          <label htmlFor='password' className='mb-1 text-[#999]'>
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => handleUserInput("password")(e)}
            name="password"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute p-1 right-4 top-[43%] text-[22px] text-blue-500 opacity-45"
          >
            {showPassword ? (
              <i className="fas fa-eye-slash" onClick={togglePassword}></i>
            ) : (
              <i className="fas fa-eye" onClick={togglePassword}></i>
            )}
          </button>
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={!name || !email || !password}
            onClick={registerUser}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Register Now
          </button>
        </div>

        <p className='mt-4 px-[2rem] text-center text-[#999] text-[14px]'>
          Already have an account?{" "}
          <a
            href="/login"
            className='font-bold text-blue-400 hover:text-[#7263f3] transition-all duration-300'
          >
            Login here
          </a>
        </p>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  )
}

export default RegisterForm