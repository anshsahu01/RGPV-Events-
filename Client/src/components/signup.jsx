import React,{useState} from 'react';
import Input from './Input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from "axios";
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';



 axios.defaults.baseURL = import.meta.env.VITE_BASE_URL ||  "http://localhost:3000";
function SignupCompo() {
 const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();


const signupUser = async (data) => {
  setLoading(true);
  setServerError(""); 

  try {

    const response = await axios.post('/api/user/register', data);


    if (response.data.success) {
      toast.success(response.data.message || 'User registered successfully!');
      navigate('/login');
    } else {
     
      toast.error(response.data.message || "Something went wrong!");
    }

  } catch (error) {
  
    console.log("Error in signup:", error);

    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
      setServerError(error.response.data.message);
    } else {

      toast.error("Registration failed. Please try again.");
    }

  } finally {
    setLoading(false);
  }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit(signupUser)} 
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

        <Input 
          label="Full Name" 
          type="text" 
          {...register("name", { 
            required: "Name is required",
            maxLength: { value: 50, message: "Name too long" }
          })} 
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <Input 
          label="Email" 
          type="email" 
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email"
            },
            maxLength: { value: 50, message: "Email too long" }
          })} 
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Input 
          label="Password" 
          type="password" 
          {...register("password", { 
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
            maxLength: { value: 20, message: "Password too long" },
            pattern: {
              value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
              message: "Password must contain at least 1 number and 1 special character"
            }
          })} 
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button 
          type="submit" 
          className="p-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span 
            onClick={() => navigate("/login")} 
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignupCompo;
