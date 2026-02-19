import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/productCard";
import { FaShippingFast, FaShieldAlt, FaStar, FaArrowRight } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import toast from "react-hot-toast";
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Fetch featured products (first 6 products)
        axios
            .get(import.meta.env.VITE_API_URL + "/api/products")
            .then((response) => {
                setFeaturedProducts(response.data.slice(0, 6));
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setIsLoading(false);
            });

        // Fetch reviews for landing page
        axios
            .get(import.meta.env.VITE_API_URL + "/api/reviews")
            .then((res) => setReviews(res.data))
            .catch((err) => console.error("Error fetching reviews:", err));
    }, []);

    const categories = [
        { name: "Haircare", icon: "💇", path: "/products/haircare", color: "from-purple-400 to-purple-600" },
        { name: "Skincare", icon: "✨", path: "/products/skincare", color: "from-pink-400 to-pink-600" },
        { name: "Watches", icon: "⌚", path: "/products/watches", color: "from-blue-400 to-blue-600" },
        { name: "Jewellery", icon: "💎", path: "/products/jewellery", color: "from-yellow-400 to-yellow-600" },
        { name: "Perfumes", icon: "🌸", path: "/products/perfumes", color: "from-rose-400 to-rose-600" },
        { name: "Accessories", icon: "👜", path: "/products/accessories", color: "from-teal-400 to-teal-600" },
    ];

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        axios.post(import.meta.env.VITE_API_URL + "/api/newsletter", { email })
            .then((response) => {
                toast.success("Thank you for subscribing!");
                setEmail("");
            })
            .catch((error) => {
                console.error("Newsletter subscription error:", error);
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Failed to subscribe. Please try again.");
                }
            });
    };

    return (
        <div className="w-full min-h-screen bg-primary">
            <Helmet>
                <title>Cosmetic Shop - Discover Your Natural Beauty</title>
                <meta name="description" content="Premium cosmetics and beauty products crafted with care. Shop skincare, haircare, and more." />
            </Helmet>
            {/* Hero Section */}
            <section className="relative w-full h-[600px] lg:h-[700px] bg-gradient-to-br from-accent/20 via-primary to-accent/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYTgxMmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                        {/* Hero Text */}
                        <div className="text-center lg:text-left space-y-6 z-10">
                            <h1 className="text-5xl lg:text-7xl font-bold text-secondary leading-tight">
                                Discover Your
                                <span className="block text-accent mt-2">Natural Beauty</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-secondary/80 max-w-xl">
                                Premium cosmetics and beauty products crafted with care. Elevate your daily routine with our curated collection.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/products"
                                    className="group bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    Shop Now
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/about"
                                    className="bg-white hover:bg-secondary/5 text-secondary px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border-2 border-secondary/20 hover:border-accent"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="hidden lg:flex justify-center items-center">
                            <div className="relative w-full h-[500px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl"></div>
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="text-[300px] opacity-20">💄</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="bg-white py-8 border-y border-secondary/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3 justify-center">
                            <FaShippingFast className="text-3xl text-accent" />
                            <div>
                                <p className="font-semibold text-secondary">Free Shipping</p>
                                <p className="text-sm text-secondary/60">On orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <FaShieldAlt className="text-3xl text-accent" />
                            <div>
                                <p className="font-semibold text-secondary">Quality Guarantee</p>
                                <p className="text-sm text-secondary/60">100% authentic</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <FaStar className="text-3xl text-accent" />
                            <div>
                                <p className="font-semibold text-secondary">Top Rated</p>
                                <p className="text-sm text-secondary/60">5-star reviews</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <MdLocalOffer className="text-3xl text-accent" />
                            <div>
                                <p className="font-semibold text-secondary">Special Offers</p>
                                <p className="text-sm text-secondary/60">Exclusive deals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-secondary/70">
                            Explore our curated collections
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={category.path}
                                className="group relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary/10 hover:border-accent/50 overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative text-center space-y-3">
                                    <div className="text-5xl mb-2">{category.icon}</div>
                                    <h3 className="font-semibold text-secondary group-hover:text-accent transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-4">
                                Featured Products
                            </h2>
                            <p className="text-lg text-secondary/70">
                                Handpicked favorites just for you
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="hidden lg:flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors"
                        >
                            View All
                            <FaArrowRight />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.productID} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12 lg:hidden">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors"
                        >
                            View All Products
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            {/* <section className="py-16 lg:py-24 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-8"> */}
            {/* New Arrivals */}
            {/* <div className="relative bg-white rounded-3xl p-8 lg:p-12 overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="relative z-10">
                                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    NEW ARRIVALS
                                </span>
                                <h3 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                                    Fresh & Trending
                                </h3>
                                <p className="text-secondary/70 mb-6">
                                    Discover the latest additions to our collection. Be the first to try our newest products.
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-4 transition-all"
                                >
                                    Explore Now
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div> */}

            {/* Special Offers */}
            {/* <div className="relative bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-8 lg:p-12 overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
                            <div className="relative z-10 text-white">
                                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    LIMITED TIME
                                </span>
                                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                                    Up to 30% Off
                                </h3>
                                <p className="text-white/90 mb-6">
                                    Don't miss out on our exclusive deals. Premium products at unbeatable prices.
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 bg-white text-accent px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
                                >
                                    Shop Deals
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Testimonials Section */}
            <section className="py-16 lg:py-24 bg-primary overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-4">
                            Loved by Thousands
                        </h2>
                        <p className="text-lg text-secondary/70 mb-6">
                            See what our community has to say about their glow-up journey.
                        </p>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                        >
                            ✍️ Share Your Experience
                        </button>
                    </div>

                    {/* Auto-scrolling Reviews Marquee */}
                    {reviews.length > 0 ? (
                        <div className="relative">
                            {/* Gradient fade edges */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none"></div>

                            <div
                                ref={scrollRef}
                                className="flex gap-6 animate-marquee hover:[animation-play-state:paused]"
                                style={{
                                    animation: `marquee ${Math.max(reviews.length * 6, 20)}s linear infinite`,
                                    width: 'max-content'
                                }}
                            >
                                {/* Duplicate reviews for seamless loop */}
                                {[...reviews, ...reviews].map((review, index) => (
                                    <div
                                        key={index}
                                        className="min-w-[320px] max-w-[380px] bg-white p-8 rounded-2xl shadow-lg border border-secondary/5 relative flex-shrink-0"
                                    >
                                        <div className="absolute -top-5 left-8 bg-accent text-white w-10 h-10 flex items-center justify-center rounded-full text-xl font-serif">
                                            "
                                        </div>
                                        <div className="flex gap-1 text-accent mb-4 mt-3">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={i < review.rating ? "text-accent" : "text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-secondary/80 mb-5 italic line-clamp-4">
                                            "{review.comment}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center font-bold text-accent text-sm">
                                                {review.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary text-sm">{review.name}</h4>
                                                <span className="text-xs text-secondary/60">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-secondary/60 mb-4">No reviews yet. Be the first to share your experience!</p>
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80"
                            >
                                Write the First Review
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Marquee CSS Animation */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            {/* Newsletter Section */}
            <section className="py-16 lg:py-24 bg-secondary text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Stay in the Loop
                    </h2>
                    <p className="text-lg text-white/80 mb-8">
                        Subscribe to our newsletter for exclusive offers, beauty tips, and new product launches.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-6 py-4 rounded-full text-secondary outline-none focus:ring-4 focus:ring-accent/50"
                        />
                        <button
                            type="submit"
                            className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-sm text-white/60 mt-4">
                        We respect your privacy. Unsubscribe anytime.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-secondary/95 text-white py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Shop</h4>
                            <ul className="space-y-2 text-white/70">
                                <li><Link to="/products" className="hover:text-accent transition-colors">All Products</Link></li>
                                <li><Link to="/products" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                                <li><Link to="/products" className="hover:text-accent transition-colors">Best Sellers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">About</h4>
                            <ul className="space-y-2 text-white/70">
                                <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
                                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Support</h4>
                            <ul className="space-y-2 text-white/70">
                                <li><a href="#" className="hover:text-accent transition-colors">Shipping Info</a></li>
                                <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
                                <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="hover:text-accent transition-colors text-2xl">📘</a>
                                <a href="#" className="hover:text-accent transition-colors text-2xl">📷</a>
                                <a href="#" className="hover:text-accent transition-colors text-2xl">🐦</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-white/60">
                        <p>&copy; 2026 Cosmetic Shop. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ===== REVIEW POPUP MODAL ===== */}
            {showReviewModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowReviewModal(false);
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowReviewModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-bold mb-2 text-secondary">Share Your Experience</h3>
                        <p className="text-secondary/60 mb-6">Tell us about our products and services</p>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const review = {
                                    name: formData.get("name"),
                                    rating: formData.get("rating"),
                                    comment: formData.get("comment"),
                                };

                                axios
                                    .post(
                                        `${import.meta.env.VITE_API_URL}/api/reviews`,
                                        review
                                    )
                                    .then((res) => {
                                        toast.success("Thank you for your review!");
                                        setReviews([res.data.review, ...reviews]);
                                        e.target.reset();
                                        setShowReviewModal(false);
                                    })
                                    .catch(() => toast.error("Failed to submit review"));
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    name="name"
                                    required
                                    placeholder="Your Name"
                                    className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                                />
                                <select
                                    name="rating"
                                    required
                                    className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4)</option>
                                    <option value="3">⭐⭐⭐ (3)</option>
                                    <option value="2">⭐⭐ (2)</option>
                                    <option value="1">⭐ (1)</option>
                                </select>
                            </div>
                            <textarea
                                name="comment"
                                required
                                placeholder="Share your experience with our products and services..."
                                className="w-full p-3 border border-gray-200 rounded-lg mb-5 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                            ></textarea>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/80 transition-all duration-200"
                                >
                                    Submit Review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 border border-secondary/30 text-secondary py-3 rounded-lg font-semibold hover:bg-secondary/10 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
