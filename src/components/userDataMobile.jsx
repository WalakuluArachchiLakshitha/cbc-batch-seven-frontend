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

    if (token) {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-8 h-8 border-4 border-accent border-b-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-3 px-4">
        <a
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg active:scale-95 transition"
        >
          <FiLogIn /> Login
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 px-4 
                 max-h-[65vh] 
                 overflow-y-auto 
                 overscroll-contain 
                 scrollbar-thin 
                 scrollbar-thumb-accent/70 
                 scrollbar-track-transparent"
    >
      {/* Profile Card */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border shadow-sm">
        <div className="flex items-center gap-4 border-b pb-4 mb-2">
          <img
            src={
              user.image || "https://ui-avatars.com/api/?name=" + user.firstName
            }
            alt="User"
            className="w-14 h-14 rounded-full border-2 border-accent object-cover shadow-md"
          />
          <div>
            <span className="text-lg font-bold">
              {user.firstName} {user.lastName}
            </span>
            <span className="block text-sm opacity-70 line-clamp-1">
              {user.email}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => (window.location.href = "/account")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/60 transition text-left"
          >
            <FiSettings /> Account Settings
          </button>

          <button
            onClick={() => (window.location.href = "/orders")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/60 transition text-left"
          >
            <FiPackage /> My Orders
          </button>

          {user.role === "admin" && (
            <button
              onClick={() => (window.location.href = "/admin")}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/60 transition text-left"
            >
              <FiShield /> Admin Panel
            </button>
          )}

          <div className="h-px bg-gray-200 my-1" />

          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 transition text-left"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#fef3e2] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-2">Log Out?</h3>
            <p className="text-center opacity-70 mb-6">
              Are you sure you want to sign out?
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl bg-gray-200"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-red-500 text-white"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
