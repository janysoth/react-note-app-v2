import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserContext = createContext();

// Set Axios to include credentials with every request
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "https://react-note-app-v2.onrender.com";

  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Register user
  const registerUser = async (e) => {
    e.preventDefault();

    if (!userState.email.includes("@") || !userState.password || userState.password.length < 6) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/v1/register`, userState);

      console.log("User registered successfully", res.data);
      toast.success("User registered successfully");

      // Clear the form 
      setUserState({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error in registering user", error);
      toast.error(error.response.data.message);
    }
  };

  // Log in 
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("User logged in successfully");

      // Clear the form
      setUserState({
        email: "",
        password: "",
      });

      // Refresh the user details
      await getUser(); // fetch before redirecting

      // Push user to the dashboard page
      router.push("/");
    } catch (error) {
      console.log("Error logging in user", error);
      toast.error(error.response.data.message);
    }
  };

  // Get User Logged in Status
  const userLoginStatus = async () => {
    let loggedIn = false;

    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true,
      });

      // Coerce the string to boolean
      loggedIn = !!res.data;
      setLoading(false);

      if (!loggedIn)
        router.push("/login");

    } catch (error) {
      console.log("Error in userLoginStatus.", error);
    }
    console.log("User logged in status: ", loggedIn);
    return loggedIn;
  };

  // Logout user
  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });

      toast.success("User logged out successfully.");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error in logoutUser.", error);
      toast.error(error.response.data.message);
    }
  };

  // getUser details
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`, {
        withCredentials: true, // send cookies to the server
      });

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      setLoading(false);
    } catch (error) {
      console.log("Error getting user details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Update user details
  const updateUser = async (e, data) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true,
      });

      // Update the User state
      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success("User updated successfully.");

      setLoading(false);
    } catch (error) {
      console.log("Error in updating user details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Email verification
  const emailVerification = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/api/v1/verify-email`, {}, {
        withCredentials: true,
      });

      toast.success("Email verification sent successfully.");
      setLoading(false);
    } catch (error) {
      console.log("Error in email verification", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Verify the User
  const verifyUser = async (token) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verify-user/${token}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("User verified successfully.");

      // Refresh the user details
      getUser();

      setLoading(false);

      // Redirect to the Home Page
      router.push("/");
    } catch (error) {
      console.log("Error in verifyUser.", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Forgot password email
  const forgotPasswordEmail = async (email) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/forgot-password`,
        { email },
        { withCredentials: true }
      );

      toast.success("Email has been sent successfully.");
      setLoading(false);
    } catch (error) {
      console.log("Error in forgotPasswordEmail.", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        {
          password,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password reset successfully");
      setLoading(false);
      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error resetting password", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      toast.success("Password changed successfully.");
      setLoading(false);
    } catch (error) {
      console.log("Error in changePassword", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  /** Admin Routes **/
  const getAllUsers = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/admin/users`,
        {},
        { withCredentials: true }
      );

      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting all users", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    setLoading(true);

    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/admin/users/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success("User deleted successfully.");
      setLoading(false);

      // Refresh the users list
      getAllUsers();
    } catch (error) {
      console.log("Error in deleting user.", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };


  // Dynamic form handler
  const handleUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn)
        await getUser();
    };

    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin")
      getAllUsers();
  }, [user.role]);

  return (
    <UserContext.Provider value={{
      userState,
      registerUser,
      loginUser,
      userLoginStatus,
      logoutUser,
      getUser,
      handleUserInput,
      user,
      updateUser,
      emailVerification,
      verifyUser,
      forgotPasswordEmail,
      resetPassword,
      changePassword,
      allUsers,
      getAllUsers,
      deleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
}

