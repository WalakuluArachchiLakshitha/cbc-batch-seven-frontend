import { useState, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { MdMenu, MdClose } from "react-icons/md";
import { FiHome, FiShoppingBag, FiInfo, FiPhone, FiShoppingCart, FiPackage } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import UserData from "./userData";
import UserDataMobile from "./userDataMobile";

export default function Header() {
	const [isSideBarOpen, setIsSidebarOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close sidebar on route change
	useEffect(() => {
		setIsSidebarOpen(false);
	}, [location]);

	return (
		<header
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
				? "h-[80px] bg-black/30 backdrop-blur-md border-b border-white/10"
				: "h-[100px] bg-accent shadow-none"
				} text-white px-6 lg:px-12 shadow-lg `}
		>
			<div className="w-full h-full flex items-center justify-between max-w-7xl mx-auto relative">

				{/* Logo Area */}
				<div className="flex items-center gap-4">
					<button
						className="lg:hidden text-2xl hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200"
						onClick={() => setIsSidebarOpen(true)}
					>
						<MdMenu />
					</button>

					<Link to="/" className="h-full flex items-center group">
						<img
							src="/logo.png"
							className={`object-contain transition-all duration-300 ${scrolled ? "h-[60px] w-auto" : "h-[90px] w-auto"
								} group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
							alt="Crystal Beauty Clear"
						/>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center gap-8 text-lg font-medium">
					{["Home", "Products", "About", "Contact", "My Orders"].map((item) => {
						const path = item === "Home" ? "/" : item === "My Orders" ? "/orders" : `/${item.toLowerCase()}`;
						const isActive = location.pathname === path;

						return (
							<Link
								key={item}
								to={path}
								className={`relative py-2 transition-colors duration-300 ${isActive ? "text-primary font-bold" : "text-white/90 hover:text-white"
									}`}
							>
								{item}
								<span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
									}`} />
							</Link>
						);
					})}
				</nav>

				{/* Right Actions */}
				<div className="flex items-center gap-6">
					<div className="hidden lg:block relative group">
						<UserData />
					</div>

					<Link
						to="/cart"
						className="relative text-2xl hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95"
					>
						<BsCart3 />
						{/* Optional: Add badge here if you have cart count in context */}
					</Link>
				</div>
			</div>

			{/* Mobile Sidebar Overlay */}
			<div
				className={`fixed inset-0  backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${isSideBarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
					}`}
				onClick={() => setIsSidebarOpen(false)}
			>
				{/* Mobile Sidebar */}
				<div
					className={`absolute relative top-0 left-0 w-[280px] h-full bg-[#fef3e2] shadow-2xl transition-transform duration-300 flex flex-col z-[110] ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					onClick={e => e.stopPropagation()}
				>
					<div className="h-[100px] bg-accent w-full flex items-center justify-between px-6 shadow-md border-b border-white/10">
						<img src="/logo.png" className="h-[80px] object-contain filter drop-shadow-md" alt="Logo" />
						<button
							onClick={() => setIsSidebarOpen(false)}
							className="text-white text-3xl hover:rotate-90 transition-transform duration-300"
						>
							<MdClose />
						</button>
					</div>

					{/* Rest of mobile menu content */}
					<div className="flex flex-col py-4 bg-primary">
						{[
							{ name: "Home", icon: <FiHome />, path: "/" },
							{ name: "Products", icon: <FiShoppingBag />, path: "/products" },
							{ name: "About", icon: <FiInfo />, path: "/about" },
							{ name: "Contact", icon: <FiPhone />, path: "/contact" },
							{ name: "Cart", icon: <FiShoppingCart />, path: "/cart" },
							{ name: "My Orders", icon: <FiPackage />, path: "/orders" }
						].map((item) => {
							return (
								<Link
									key={item.name}
									to={item.path}
									className="group flex items-center gap-4 px-8 py-4 text-secondary/80 hover:bg-accent/10 hover:text-accent hover:pl-10 transition-all duration-300 border-b border-secondary/5 font-medium"
								>
									<span className="text-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
									{item.name}
								</Link>
							);
						})}
					</div>

					<div className="bg-primary pt-5 pb-7 text-black">
						<UserDataMobile />
					</div>



				</div>
			</div>
		</header>
	);
}
