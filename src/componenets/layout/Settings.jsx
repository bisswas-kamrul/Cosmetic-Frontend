import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "dashboardSettings";

const defaultSettings = {
  theme: "light",
  emailNotifications: true,
  language: "en",
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored) {
      setSettings({ ...defaultSettings, ...stored });
    }
  }, []);

  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  const handleSave = (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      localStorage.setItem("dashboardTheme", settings.theme);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 bg-gray-50 dark:bg-black dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage display preferences, notifications, and language options.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Display Preferences</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Theme
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, theme: e.target.value }))
                  }
                  className="h-10 rounded-lg border border-input bg-transparent px-3 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/50">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Language
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="h-10 rounded-lg border border-input bg-transparent px-3 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/50">
                  <option value="en">English</option>
                  <option value="es">Bangala</option>
                  <option value="fr">Français</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Email Notifications
                <div className="flex items-center gap-3 pt-2">
                  <Input
                    id="email-notifications"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Enable email alerts
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Account Notifications</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 p-4">
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive emails for important account updates and activity.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 p-4">
                <p className="text-sm font-medium">Language support</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use this placeholder to extend language preferences later.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              className="bg-black text-white"
              disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Settings are stored locally and restored automatically.
            </p>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </main>
  );
};

export default Settings;
