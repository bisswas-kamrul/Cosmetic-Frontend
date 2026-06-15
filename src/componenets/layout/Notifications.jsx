import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dashboardNotifications";

const defaultNotifications = [
  {
    _id: "demo-notification-1",
    title: "Welcome to Dashboard",
    message:
      "Your dashboard is ready. You can manage users, products, and settings from here.",
    type: "system",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-notification-2",
    title: "Wishlist Feature Ready",
    message: "Use the wishlist page to keep track of saved items.",
    type: "wishlist",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const saveToLocal = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const loadFallback = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(stored) && stored.length > 0) {
      setNotifications(stored);
    } else {
      setNotifications(defaultNotifications);
      saveToLocal(defaultNotifications);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://cosmetic-backend-e6ia.onrender.com/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data?.data || [];
      setNotifications(data);
      saveToLocal(data);
    } catch (error) {
      loadFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const updateNotification = async (notificationId) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://cosmetic-backend-e6ia.onrender.com/notifications/${notificationId}/read`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updated = notifications.map((item) =>
        item._id === notificationId ? { ...item, isRead: true } : item,
      );
      setNotifications(updated);
      saveToLocal(updated);
      toast.success("Notification marked as read");
    } catch (error) {
      const updated = notifications.map((item) =>
        item._id === notificationId ? { ...item, isRead: true } : item,
      );
      setNotifications(updated);
      saveToLocal(updated);
      toast.success("Marked as read locally");
    } finally {
      setUpdating(false);
    }
  };

  const markAllRead = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://cosmetic-backend-e6ia.onrender.com/notifications/read-all",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updated = notifications.map((item) => ({ ...item, isRead: true }));
      setNotifications(updated);
      saveToLocal(updated);
      toast.success("All notifications marked as read");
    } catch (error) {
      const updated = notifications.map((item) => ({ ...item, isRead: true }));
      setNotifications(updated);
      saveToLocal(updated);
      toast.success("All notifications marked as read locally");
    } finally {
      setUpdating(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <main className="p-6 bg-gray-50 dark:bg-black dark:text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track unread and recent activity messages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {unreadCount} unread
            </span>
            <Button
              variant="outline"
              onClick={markAllRead}
              disabled={updating || unreadCount === 0}>
              {updating ? "Please wait..." : "Mark all read"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300">
              No notifications available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-2xl border p-5 transition ${
                  notification.isRead
                    ? "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
                    : "bg-slate-100 dark:bg-zinc-800 border-blue-400/30"
                }`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {notification.title}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500">
                      {notification.type || "system"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        notification.isRead
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                      }`}>
                      {notification.isRead ? "Read" : "Unread"}
                    </span>
                    {!notification.isRead && (
                      <Button
                        variant="secondary"
                        onClick={() => updateNotification(notification._id)}
                        disabled={updating}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </main>
  );
};

export default Notifications;
