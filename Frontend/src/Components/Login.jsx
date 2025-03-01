import axios from "axios";
import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {  addUser } from "../utils/userSlice";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7777/api/v1/logIn",
        { emailId, password },
        { withCredentials: true } // to set cookie
        );
        console.log(res.data.loggedInUser)
        dispatch(addUser(res.data.loggedInUser));

      //console.log(res);
      toast.success("LoggedIn Successfully");
      return navigate("/");
    } catch (error) {
        console.log(error)
        if (error.response) toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="card card-dash bg-base-100 w-96 mt-14">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email Id</legend>
          <input
            type="text"
            className="input"
            value={emailId}
            placeholder="abc@gmail.com"
            onChange={(e) => setEmailId(e.target.value)}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            className="input"
            placeholder="**************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
