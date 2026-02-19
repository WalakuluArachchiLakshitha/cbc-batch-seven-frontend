import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import { ProductPage } from "./productPage";
import ProductOverview from "./productOverview";
import CartPage from "./cart";
import CheckoutPage from "./checkout";
import LandingPage from "./LandingPage";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import PaymentPage from "./paymentPage";
import OrdersPage from "./ordersPage";

export default function HomePage() {
	return (
		<div className="w-full h-full bg-primary">
			<Header />
			<Routes path="/">
				<Route path="/" element={<LandingPage />} />
				<Route path="/products" element={<ProductPage />} />
				<Route path="/products/:category" element={<ProductPage />} />
				<Route path="/contact" element={<ContactUs />} />
				<Route path="/about" element={<AboutUs />} />
				<Route path="/overview/:id" element={<ProductOverview />} />
				<Route path="/cart" element={<CartPage />} />
				<Route path="/checkout" element={<CheckoutPage />} />
				<Route path="/payment" element={<PaymentPage />} />
				<Route path="/orders" element={<OrdersPage />} />
				<Route path="/*" element={<h1>404 Not Found</h1>} />
			</Routes>
		</div>
	);
}
