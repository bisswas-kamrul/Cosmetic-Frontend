import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://cosmetic-backend-e6ia.onrender.com/login",
        {
          email,
          password,
        },
      );

      // Save token
      localStorage.setItem("token", data.token);

      // Save user info
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      alert("Login Successful");

      // Role based redirect
      if (data.user.role === "admin") {
        window.location.href = `${adminUrl}/Sidebar`;
      } else if (data.user.role === "vendor") {
        navigate("/VendorDashboard");
      } else {
        navigate("/MyAccountDashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "wihte",
        padding: "20px",
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#333",
            fontSize: "32px",
            fontWeight: "bold",
          }}>
          Welcome
        </h1>

        <form onSubmit={submitHandler}>
          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "17px",
              fontWeight: "bold",
              marginBottom: "15px",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.9")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}>
            Login
          </button>

          {/* Signup Button */}
          <Link to="/Singup" style={{ textDecoration: "none" }}>
            <button
              type="button"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#f1f1f1",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "15px",
              }}>
              Create New Account
            </button>
          </Link>

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/ForgotPassword")}
            style={{
              textAlign: "center",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "600",
              marginTop: "10px",
            }}>
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

export default Login;
