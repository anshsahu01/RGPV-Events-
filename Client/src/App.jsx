import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {store} from './redux/store'
import { setTokens,setUserId } from "./redux/authSlice";

function App() {

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
const userId = localStorage.getItem("userId");

if (accessToken && refreshToken && userId) {
  console.log("accesstoken",accessToken);
  console.log("userId",userId);
  store.dispatch(setTokens({ accessToken, refreshToken }));
  store.dispatch(setUserId(userId));
}
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </div>
  );
}

export default App;
