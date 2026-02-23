import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiPackage,
  FiLogOut,
  FiShield,
  FiLogIn,
  FiSettings,
} from "react-icons/fi";

export default function UserDataMobile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 border-4 border-accent border-b-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <a
        href="/login"
        className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white rounded-xl font-bold shadow-md active:scale-95 transition"
      >
        <FiLogIn /> Login
      </a>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-md border">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={
              user.image || `https://ui-avatars.com/api/?name=${user.firstName}`
            }
            alt="User"
            className="w-12 h-12 rounded-full border-2 border-accent object-cover"
          />
          <div className="min-w-0">
            <p className="font-semibold truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs opacity-70 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <button
            onClick={() => (window.location.href = "/settings")}
            className="flex items-center gap-2 py-2 hover:text-accent transition"
          >
            <FiSettings /> Account Settings
          </button>

          <button
            onClick={() => (window.location.href = "/orders")}
            className="flex items-center gap-2 py-2 hover:text-accent transition"
          >
            <FiPackage /> My Orders
          </button>

          {user.role === "admin" && (
            <button
              onClick={() => (window.location.href = "/admin")}
              className="flex items-center gap-2 py-2 hover:text-accent transition"
            >
              <FiShield /> Admin Panel
            </button>
          )}

          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-center mb-2">Log Out?</h3>
            <p className="text-center text-sm opacity-70 mb-5">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 bg-gray-200 rounded-lg"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
