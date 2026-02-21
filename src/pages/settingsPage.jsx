import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserSettings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  async function updateUserData() {
    try {
      let imageLink = user?.image || "";

      if (image) {
        imageLink = await mediaUpload(image);
      }

      const data = {
        firstName,
        lastName,
        image: imageLink,
      };

      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/api/users/me",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(res.data.message);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
    navigate("/");
  }
  async function updatePassword() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/me/password",
        {
          password: password,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then(() => {
        toast.success("Password updated successfully");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        toast.error("Failed to update password");
      });
    navigate("/");
  }

  const imagePreview = useMemo(
    () => (image ? URL.createObjectURL(image) : ""),
    [image],
  );
  const pwdMismatch =
    password && confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-screen w-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center py-4 px-2 overflow-auto">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="w-full backdrop-blur-2xl rounded-2xl p-4 flex flex-col bg-primary/90 shadow-xl ring-1 ring-secondary/10">
          <h1 className="text-xl font-bold mb-4 text-center text-secondary">
            User Settings
          </h1>
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-accent/60">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-secondary/10 text-secondary/60 text-sm">
                  No Photo
                </div>
              )}
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer bg-white/80 hover:bg-white transition border border-secondary/10 text-sm">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-secondary/80 mb-1">
                First name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-secondary/80 mb-1">
                Last name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>
          <button
            onClick={updateUserData}
            className="mt-5 w-full px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow"
          >
            Save Profile
          </button>
        </div>

        <div className="w-full backdrop-blur-2xl rounded-2xl p-4 flex flex-col bg-primary/90 shadow-xl ring-1 ring-secondary/10">
          <h2 className="text-xl font-bold mb-4 text-center text-secondary">
            Change Password
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-secondary/80 mb-1">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-secondary/80 mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            {pwdMismatch && (
              <p className="text-xs text-red-600">Passwords do not match.</p>
            )}
          </div>
          <button
            onClick={updatePassword}
            disabled={!password || !confirmPassword || pwdMismatch}
            className="mt-5 w-full px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
