import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "../../components/loader";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdBlock, MdCheckCircle } from "react-icons/md";

// ─── Block / Unblock Confirmation Modal ──────────────────────────────────────
function UserBlockConfirm({ user, close, refresh }) {
    function handleBlock() {
        const token = localStorage.getItem("token");
        axios
            .put(
                import.meta.env.VITE_API_URL + "/api/users/block/" + user.email,
                { isBlock: !user.isBlock },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                close();
                toast.success(
                    user.isBlock
                        ? "User unblocked successfully"
                        : "User blocked successfully"
                );
                refresh();
            })
            .catch(() => {
                toast.error("Failed to change user block status");
            });
    }

    return (
        <div className="fixed left-0 top-0 w-full h-screen bg-[#00000050] z-[100] flex justify-center items-center">
            <div className="w-[450px] bg-primary rounded-2xl p-6 flex flex-col items-center gap-5 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
                    <MdBlock className="text-2xl text-yellow-600" />
                </div>
                <p className="text-lg font-semibold text-center text-secondary">
                    Are you sure you want to{" "}
                    <span className={user.isBlock ? "text-green-600" : "text-red-600"}>
                        {user.isBlock ? "unblock" : "block"}
                    </span>{" "}
                    this user?
                </p>
                <p className="text-sm text-secondary/60">{user.email}</p>
                <div className="flex gap-4 w-full">
                    <button
                        onClick={close}
                        className="flex-1 py-2 rounded-lg border border-secondary/20 text-secondary hover:bg-secondary/5 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBlock}
                        className={`flex-1 py-2 rounded-lg text-white transition ${user.isBlock
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {user.isBlock ? "Unblock" : "Block"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
function UserDeleteConfirm({ user, close, refresh }) {
    function handleDelete() {
        const token = localStorage.getItem("token");
        axios
            .delete(import.meta.env.VITE_API_URL + "/api/users/" + user.email, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                close();
                toast.success("User deleted successfully");
                refresh();
            })
            .catch(() => {
                toast.error("Failed to delete user");
            });
    }

    return (
        <div className="fixed left-0 top-0 w-full h-screen bg-[#00000050] z-[100] flex justify-center items-center">
            <div className="w-[450px] bg-primary rounded-2xl p-6 flex flex-col items-center gap-5 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <FaRegTrashCan className="text-xl text-red-600" />
                </div>
                <p className="text-lg font-semibold text-center text-secondary">
                    Are you sure you want to{" "}
                    <span className="text-red-600">permanently delete</span> this user?
                </p>
                <p className="text-sm text-secondary/60">{user.email}</p>
                <div className="flex gap-4 w-full">
                    <button
                        onClick={close}
                        className="flex-1 py-2 rounded-lg border border-secondary/20 text-secondary hover:bg-secondary/5 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Admin Users Page ───────────────────────────────────────────────────
export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isBlockConfirmVisible, setIsBlockConfirmVisible] = useState(false);
    const [userToBlock, setUserToBlock] = useState(null);

    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const navigate = useNavigate();

    function loadUsers() {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setIsLoading(true);
        axios
            .get(import.meta.env.VITE_API_URL + "/api/users/all-users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUsers(res.data);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load users");
                setIsLoading(false);
            });
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="w-full min-h-full">
            {/* Block/Unblock Modal */}
            {isBlockConfirmVisible && (
                <UserBlockConfirm
                    user={userToBlock}
                    close={() => setIsBlockConfirmVisible(false)}
                    refresh={loadUsers}
                />
            )}

            {/* Delete Modal */}
            {isDeleteConfirmVisible && (
                <UserDeleteConfirm
                    user={userToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
                    refresh={loadUsers}
                />
            )}

            <div className="mx-auto max-w-7xl p-6">
                <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">
                    {/* Header bar */}
                    <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">
                        <h1 className="text-lg font-semibold text-secondary">Users</h1>
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                            {users.length} users
                        </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="bg-secondary text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Image</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Name</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Email</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">Role</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">Email Verified</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary/10">
                                    {users.map((user) => (
                                        <tr
                                            key={user._id || user.email}
                                            className="odd:bg-white even:bg-primary hover:bg-accent/5 transition-colors"
                                        >
                                            {/* Profile Image */}
                                            <td className="px-4 py-3">
                                                <img
                                                    src={user.image || "/user.png"}
                                                    alt={user.firstName}
                                                    referrerPolicy="no-referrer"
                                                    className={`w-10 h-10 rounded-full object-cover border-2 ${user.isBlock
                                                            ? "border-red-400"
                                                            : "border-green-400"
                                                        }`}
                                                />
                                            </td>
                                            {/* Name */}
                                            <td className="px-4 py-3 font-medium text-secondary">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            {/* Email */}
                                            <td className="px-4 py-3 text-secondary/70">
                                                <span className="flex items-center gap-1">
                                                    {user.email}
                                                    {user.isEmailVerified && (
                                                        <MdCheckCircle className="text-blue-500 text-sm" />
                                                    )}
                                                </span>
                                            </td>
                                            {/* Role */}
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${user.role === "admin"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            {/* Email Verified */}
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.isEmailVerified
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {user.isEmailVerified ? "Verified" : "Not Verified"}
                                                </span>
                                            </td>
                                            {/* Status */}
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.isBlock
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {user.isBlock ? "Blocked" : "Active"}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setUserToBlock(user);
                                                            setIsBlockConfirmVisible(true);
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer transition ${user.isBlock
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : "bg-accent hover:bg-accent/80"
                                                            }`}
                                                        title={user.isBlock ? "Unblock user" : "Block user"}
                                                    >
                                                        {user.isBlock ? "Unblock" : "Block"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(user);
                                                            setIsDeleteConfirmVisible(true);
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition"
                                                        title="Delete user"
                                                    >
                                                        <FaRegTrashCan className="text-sm" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td className="px-4 py-12 text-center text-secondary/60" colSpan={7}>
                                                No users to display.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
