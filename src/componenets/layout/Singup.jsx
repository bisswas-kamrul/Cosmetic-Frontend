import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:4000/signup", {
        name,
        lastName,
        email,
        password,
        role,
        storeName,
        phone,
        address,
      });

      alert(data.message);

      // Clear Inputs
      setName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setStoreName("");
      setPhone("");
      setAddress("");

      // Redirect
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
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
          Create Account
        </h1>

        <form onSubmit={submitHandler}>
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={inputStyle}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>

          {role === "vendor" && (
            <>
              <input
                type="text"
                placeholder="Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Business Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Business Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.9")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}>
            Signup
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#555",
          }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#007bff",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            Login
          </span>
        </p>
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
  transition: "0.3s",
  boxSizing: "border-box",
};

export default Signup;
