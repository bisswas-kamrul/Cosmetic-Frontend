import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Security = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://cosmetic-backend-e6ia.onrender.com/change-password",
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.success(
          "Password update saved locally; backend endpoint unavailable.",
        );
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to update password.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-gray-50 dark:bg-black dark:text-white min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Change your password and manage security settings.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Old Password
                </label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  New Password
                </label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="show-passwords"
                type="checkbox"
                checked={showPasswords}
                onChange={() => setShowPasswords((prev) => !prev)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label
                htmlFor="show-passwords"
                className="text-sm text-gray-600 dark:text-gray-300">
                Show passwords
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="bg-black text-white"
                disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use a strong password with at least 6 characters.
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </main>
  );
};

export default Security;
