import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyAccountDashboard = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/Login");
          return;
        }

        const { data } = await axios.get(
          "https://cosmetic-backend-e6ia.onrender.com/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(data);

        // localStorage update
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (error) {
        console.log(error);

        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");

        navigate("/Login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          "https://cosmetic-backend-e6ia.onrender.com/My-Order",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    navigate("/Login");
  };

  const menuItems = [
    { icon: Heart, label: "Wishlist", path: "/Wishlist" },
    { icon: Bell, label: "Notifications", path: "/Notifications" },
    { icon: Lock, label: "Security", path: "/security" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg p-6 hidden md:block">
        <div className="flex flex-col items-center">
          <img
            src={
              user?.avatar ||
              "https://cosmetic-backend-e6ia.onrender.com/update-profile"
            }
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
          />

          <h2 className="mt-4 text-xl font-bold">
            {user?.name} {user?.lastName}
          </h2>

          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>

        <div className="mt-8 space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-100 transition cursor-pointer">
              <item.icon className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition cursor-pointer">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-500 mt-1">
            Manage your profile and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <User className="text-blue-600" />
              <h2 className="text-xl font-semibold">Profile Info</h2>
            </div>

            <div className="mt-5 space-y-4">
              <p>
                <span className="font-semibold">Name:</span> {user?.name}{" "}
                {user?.lastName}
              </p>

              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>

              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {user?.phone || "Not added"}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {user?.address || "Not added"}
              </p>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-green-600" />
              <h2 className="text-xl font-semibold">My Orders</h2>
            </div>

            <div className="mt-5 space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-xl p-4 bg-gray-50">
                    <p>
                      <span className="font-semibold">Order ID:</span>{" "}
                      {order._id}
                    </p>

                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {order.status}
                    </p>

                    <p>
                      <span className="font-semibold">Payment:</span>{" "}
                      {order.paymentMethod}
                    </p>

                    <p>
                      <span className="font-semibold">Paid:</span>{" "}
                      {order.isPaid ? "Yes" : "No"}
                    </p>

                    <p>
                      <span className="font-semibold">Total:</span> ৳
                      {order.finalTotal}
                    </p>

                    <p>
                      <span className="font-semibold">Items:</span>{" "}
                      {order.items?.length}
                    </p>

                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountDashboard;
