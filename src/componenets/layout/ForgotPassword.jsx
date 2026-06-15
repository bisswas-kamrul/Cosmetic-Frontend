import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:4000/ForgotPassword", {
        email,
      });

      alert(res.data.message);
      setEmail("");
      navigate("/ResetPassword");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={submitHandler} className="border p-6 rounded w-96">
          <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>

          <input
            type="email"
            placeholder="Enter email"
            className="border w-full p-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 cursor-pointer rounded w-full">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
