import { useState, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { MdMenu, MdClose } from "react-icons/md";
import {
  FiHome,
  FiShoppingBag,
  FiInfo,
  FiPhone,
  FiShoppingCart,
  FiPackage,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import UserData from "./userData";
import UserDataMobile from "./userDataMobile";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ============ Close Sidebar On Route Change ============ */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  /* ============ Prevent Background Scroll When Sidebar Open ============ */
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  const navItems = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Products", path: "/products", icon: <FiShoppingBag /> },
    { name: "About", path: "/about", icon: <FiInfo /> },
    { name: "Contact", path: "/contact", icon: <FiPhone /> },
    { name: "Cart", path: "/cart", icon: <FiShoppingCart /> },
    { name: "My Orders", path: "/orders", icon: <FiPackage /> },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "h-[80px] bg-black/30 backdrop-blur-md border-b border-white/10"
            : "h-[100px] bg-accent"
        } text-white px-6 lg:px-12 shadow-lg`}
      >
        <div className="w-full h-full flex items-center justify-between max-w-7xl mx-auto">
          {/* ===== Left Side ===== */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-3xl hover:scale-110 transition"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MdMenu />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className={`transition-all duration-300 ${
                  scrolled ? "h-[60px]" : "h-[90px]"
                }`}
              />
            </Link>
          </div>

          {/* ===== Desktop Navigation ===== */}
          <nav className="hidden lg:flex items-center gap-8 text-lg font-medium">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative py-2 ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ===== Right Side ===== */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:block">
              <UserData />
            </div>

            <Link to="/cart" className="text-2xl hover:scale-110 transition">
              <BsCart3 />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR ================= */}

      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        {/* Sidebar Panel */}
        <div
          className={`absolute top-0 left-0 w-[280px] h-screen bg-[#fef3e2] shadow-2xl flex flex-col transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="h-[90px] bg-accent flex items-center justify-between px-6 shrink-0">
            <img src="/logo.png" alt="Logo" className="h-[65px]" />
            <button
              className="text-white text-3xl"
              onClick={() => setIsSidebarOpen(false)}
            >
              <MdClose />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-scroll px-2 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-accent/10 hover:text-accent transition"
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* User Section */}
            <div className="pt-4 border-t mt-4">
              <UserDataMobile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
