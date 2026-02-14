



import React from 'react';
import Input from './Input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axiosInstance';
import { toast } from "react-toastify";
import { setUserId, setTokens } from '../redux/authSlice';



//  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL ||  "http://localhost:3000";

function LoginCompo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const loginUser = async (data) => {
    try {
      const resp = await api.post(
        "/user/login",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      const result = resp.data;
      // console.log("LOGIN RESPONSE:", result);

      if (result?.statuscode === 200 || result?.success) {
  
        dispatch(setUserId(result.data.user._id || result.data.userId));
        dispatch(setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken
        }));

       
          localStorage.setItem("accessToken", result.data.accessToken );
  localStorage.setItem("refreshToken",result.data.refreshToken);
  localStorage.setItem("userId", result.data.user._id || result.data.userId);

        



        toast.success("Login successful!");
        navigate("/"); 
      } else {
        toast.error(result?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) toast.error("Invalid email or password");
        else if (status === 404) toast.error("User not found");
        else toast.error(data?.message || "Login failed");
      } else {
        toast.error("Server not reachable. Try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(loginUser)}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {/* Email */}
        <Input
          label="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email"
            },
            maxLength: {
              value: 50,
              message: "Email too long"
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Password */}
        <Input
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            },
            maxLength: { value: 20, message: "Password too long" }
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          Login
        </button>

        {/* Link */}
        <p className="text-center text-sm text-gray-600">
          Not registered?{"/signup"}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginCompo;
