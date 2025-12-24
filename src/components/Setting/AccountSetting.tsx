import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";

const AccountSetting = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // <-- new password state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email || "");
      }
    };
    loadUser();
  }, []);

  const handlePasswordChange = async () => {
    if (!newPassword) {
      setMessage("Please enter a new password");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully ✅");
      setNewPassword(""); // clear input after success
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-gray-100 min-h-screen space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account preferences and security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-orange-700 mb-4">
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full px-4 py-2 rounded-lg border bg-gray-100 text-gray-700"
              />
            </div>

            <p className="text-xs text-gray-400">
              Email cannot be changed at the moment.
            </p>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-orange-700 mb-4">
            Security
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg border text-gray-700"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>

            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-orange-700 mb-4">
            Preferences
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive order updates and alerts</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
