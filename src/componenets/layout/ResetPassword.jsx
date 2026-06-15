import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewpassword] = useState("");

  // RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://cosmetic-backend-e6ia.onrender.com/ResetPassword",
        {
          email,
          otp,
          newpassword,
        },
      );

      alert(res.data.message);
      navigate("/Login");
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <form
          onSubmit={resetPassword}
          className="border p-6 w-96 bg-white rounded shadow-md relative z-10">
          <h2 className="text-xl mb-4 font-semibold">Reset Password</h2>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter Email"
            className="border w-full p-2 mb-3 text-black bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* OTP */}
          <input
            type="text"
            placeholder="Enter OTP"
            className="border w-full p-2 mb-3 text-black bg-white"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {/* NEW PASSWORD */}
          <input
            type="password"
            placeholder="New Password"
            className="border w-full p-2 mb-3 text-black bg-white"
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
          />

          <button type="submit" className="bg-black text-white w-full p-2">
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
