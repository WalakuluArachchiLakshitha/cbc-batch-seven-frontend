import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { MdShoppingCartCheckout, MdMenu, MdClose } from "react-icons/md";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineUsers, HiOutlineExternalLink } from "react-icons/hi";
import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/adminAddNewProduct";
import UpdateProductPage from "./admin/adminUpdateProduct";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminDashboard from "./admin/adminDashboard";
import AdminUsersPage from "./admin/adminUsersPage";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login to access admin panel");
      navigate("/login");
      return;
    }
    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.role !== "admin") {
          toast.error("You are not authorized to access admin panel");
          navigate("/");
          return;
        }
        setUserLoaded(true);
      })
      .catch(() => {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, [navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const navItems = [
    { path: "/admin", icon: <FaChartLine />, label: "Dashboard" },
    {
      path: "/admin/orders",
      icon: <MdShoppingCartCheckout className="text-xl" />,
      label: "Orders",
    },
    { path: "/admin/products", icon: <BsBox2Heart />, label: "Products" },
    { path: "/admin/users", icon: <HiOutlineUsers />, label: "Users" },
  ];

  return (
    <div className="w-full h-screen bg-primary flex text-secondary overflow-hidden relative">
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-white rounded-lg shadow-md text-accent"
        >
          <MdMenu size={28} />
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
				fixed inset-y-0 left-0 z-[70] w-[280px] bg-primary shadow-2xl lg:shadow-none lg:static lg:w-[300px] lg:flex flex-col items-center gap-6 py-6 transition-transform duration-300 ease-in-out
				${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
			`}
      >
        <div className="flex flex-row w-[90%] h-[70px] bg-accent items-center rounded-2xl px-2 relative mx-auto">
          <img
            src="/logo.png"
            alt="CBC"
            className="h-[50px] w-auto brightness-0 invert"
          />
          <span className="text-white text-lg font-bold ml-2">Admin Panel</span>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-1/2 -translate-y-1/2 right-2 text-white/80 hover:text-white"
          >
            <MdClose size={24} />
          </button>

          <Link
            to="/"
            title="View Store"
            className="ml-auto mr-1 w-8 h-8 hidden lg:flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition"
          >
            <HiOutlineExternalLink className="text-lg" />
          </Link>
        </div>

        <div className="w-full flex flex-col gap-2 items-center">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
									${
                    isActive
                      ? "bg-accent/10 text-accent shadow-sm border border-accent/20"
                      : "text-secondary/70 hover:bg-white hover:shadow-md hover:text-secondary"
                  }
								`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto w-[90%] lg:hidden">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-white font-medium"
          >
            <HiOutlineExternalLink /> Visit Shop
          </Link>
        </div>
      </div>

      <div className="flex-1 h-full p-2 lg:p-4 overflow-hidden">
        <div className="h-full w-full border-[2px] lg:border-[4px] border-accent/20 lg:border-accent rounded-2xl lg:rounded-[30px] overflow-hidden bg-white/50 relative">
          <div className="h-full w-full overflow-y-auto scrollbar-hide">
            <div className="pt-16 lg:pt-0 min-h-full">
              {userLoaded ? (
                <Routes path="/">
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/products" element={<AdminProductPage />} />
                  <Route path="/orders" element={<AdminOrdersPage />} />
                  <Route path="/users" element={<AdminUsersPage />} />
                  <Route path="/add-product" element={<AddProductPage />} />
                  <Route
                    path="/update-product"
                    element={<UpdateProductPage />}
                  />
                </Routes>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
