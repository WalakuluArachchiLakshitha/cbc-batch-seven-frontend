import axios from "axios";
import { useEffect, useState } from "react";
import { FiUser, FiPackage, FiLogOut, FiShield, FiLogIn, FiSettings } from "react-icons/fi";

export default function UserDataMobile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token != null) {
            axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                setUser(res.data);
                setLoading(false);
            }).catch(() => {
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
                    className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 active:scale-95 transition-all"
                >
                    <FiLogIn /> Login
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 px-4">
            {/* User Profile Card */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
                <div className="flex items-center gap-4 border-b border-secondary/5 pb-4 mb-2">
                    <img
                        src={user.image || "https://ui-avatars.com/api/?name=" + user.firstName}
                        alt="User"
                        className="w-14 h-14 rounded-full border-2 border-accent object-cover shadow-md"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-secondary">{user.firstName} {user.lastName}</span>
                        <span className="text-sm text-secondary/60 line-clamp-1">{user.email}</span>
                    </div>
                </div>

                {/* Actions List */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => window.location.href = "/account"}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/60 transition-colors text-secondary font-medium text-left group"
                    >
                        <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                            <FiSettings size={18} />
                        </div>
                        Account Settings
                    </button>

                    <button
                        onClick={() => window.location.href = "/orders"}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/60 transition-colors text-secondary font-medium text-left group"
                    >
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FiPackage size={18} />
                        </div>
                        My Orders
                    </button>

                    {user.role === "admin" && (
                        <button
                            onClick={() => window.location.href = "/admin"}
                            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/60 transition-colors text-secondary font-medium text-left group"
                        >
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <FiShield size={18} />
                            </div>
                            Admin Panel
                        </button>
                    )}

                    <div className="h-px bg-secondary/5 my-1" />

                    <button
                        onClick={() => setIsLogoutConfirmOpen(true)}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 font-medium text-left group"
                    >
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <FiLogOut size={18} />
                        </div>
                        Logout
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="fixed  inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="flex-col flex w-full max-w-sm bg-[#fef3e2] rounded-2xl p-6 shadow-2xl scale-in-95 animate-in duration-200 border border-white/20">
                        <h3 className="text-xl font-bold text-secondary mb-2 text-center">Log Out?</h3>
                        <p className="text-secondary/60 text-center mb-6">Are you sure you want to sign out of your account?</p>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gray-200 text-secondary hover:bg-gray-300 transition-colors"
                                onClick={() => setIsLogoutConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors"
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