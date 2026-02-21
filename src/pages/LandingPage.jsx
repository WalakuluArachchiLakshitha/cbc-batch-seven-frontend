import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/productCard";
import {
  FaShippingFast,
  FaShieldAlt,
  FaStar,
  FaArrowRight,
  FaQuoteLeft,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/products")
      .then((res) => {
        setFeaturedProducts(res.data.slice(0, 6));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    axios
      .get(import.meta.env.VITE_API_URL + "/api/reviews")
      .then((res) => setReviews(res.data))
      .catch(() => {});
  }, []);

  const categories = [
    {
      name: "Haircare",
      icon: "💇‍♀️",
      path: "/products/haircare",
      color: "from-purple-100 to-purple-50",
    },
    {
      name: "Skincare",
      icon: "✨",
      path: "/products/skincare",
      color: "from-pink-100 to-pink-50",
    },
    {
      name: "Watches",
      icon: "⌚",
      path: "/products/watches",
      color: "from-blue-100 to-blue-50",
    },
    {
      name: "Jewellery",
      icon: "💎",
      path: "/products/jewellery",
      color: "from-yellow-100 to-yellow-50",
    },
    {
      name: "Perfumes",
      icon: "🌸",
      path: "/products/perfumes",
      color: "from-rose-100 to-rose-50",
    },
    {
      name: "Accessories",
      icon: "👜",
      path: "/products/accessories",
      color: "from-teal-100 to-teal-50",
    },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    axios
      .post(import.meta.env.VITE_API_URL + "/api/newsletter", { email })
      .then(() => {
        toast.success("Thank you for subscribing!");
        setEmail("");
      })
      .catch((error) => {
        console.error("Newsletter subscription error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to subscribe. Please try again.");
        }
      });
  };

  return (
    <div className="w-full min-h-screen bg-primary">
      <Helmet>
        <title>Crystal Beauty Clear - Discover Your Natural Radiance</title>
        <meta
          name="description"
          content="Premium cosmetics and beauty products crafted with care. Shop skincare, haircare, and more."
        />
      </Helmet>

      <section className="relative w-full min-h-[85vh] pt-32 lg:pt-36 flex items-center bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 animate-slide-in-left">
            <span className="inline-block px-4 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent font-semibold text-sm tracking-wider uppercase mb-2">
              Premium Beauty Collection
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-secondary leading-[1.1] tracking-tight">
              Reveal Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
                Inner Radiance
              </span>
            </h1>
            <p className="text-lg text-secondary/70 max-w-lg leading-relaxed">
              Discover a curated selection of premium cosmetics designed to
              enhance your natural beauty. Luxury meets purity in every bottle.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/products"
                className="btn-primary flex items-center gap-2 group text-lg px-8 py-4"
              >
                Shop Collection
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-full border border-secondary/20 font-semibold text-secondary hover:bg-white hover:border-white hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              >
                Our Story
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-80">
              <div>
                <h4 className="text-3xl font-bold text-secondary">50k+</h4>
                <p className="text-sm text-secondary/60">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-secondary/10"></div>
              <div>
                <h4 className="text-3xl font-bold text-secondary">100%</h4>
                <p className="text-sm text-secondary/60">Organic Ingredients</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <div className="relative w-[500px] h-[500px] animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-[100px] animate-pulse"></div>

              <div className="relative z-10 w-full h-full flex items-center justify-center text-[250px] drop-shadow-2xl filter hover:scale-105 transition-transform duration-500 cursor-pointer">
                🧴
              </div>

              <div
                className="absolute top-20 -right-4 glass-card p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-lg"
                style={{ animationDuration: "3s" }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  🌿
                </div>
                <div className="text-sm font-semibold text-secondary">
                  100% Natural
                </div>
              </div>
              <div
                className="absolute bottom-20 -left-8 glass-card p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-lg"
                style={{ animationDuration: "4s" }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  ✨
                </div>
                <div className="text-sm font-semibold text-secondary">
                  Premium Quality
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/50 backdrop-blur-md border-y border-secondary/5 py-10 relative z-20 mt-10 mx-4 lg:mx-12 rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {[
            {
              icon: <FaShippingFast />,
              title: "Free Shipping",
              desc: "On orders over LKR 5000",
            },
            {
              icon: <FaShieldAlt />,
              title: "Secure Payment",
              desc: "100% protected payments",
            },
            {
              icon: <FaStar />,
              title: "Top Rated",
              desc: "Loved by thousands",
            },
            {
              icon: <MdLocalOffer />,
              title: "Special Offers",
              desc: "Discounts for members",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-2 group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="text-3xl text-accent mb-2 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-bold text-secondary text-lg">
                {feature.title}
              </h3>
              <p className="text-sm text-secondary/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold tracking-wider uppercase text-sm">
            Collections
          </span>
          <h2 className="text-4xl font-bold text-secondary mt-2 mb-4">
            Shop by Category
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className={`group relative bg-gradient-to-br ${cat.color} rounded-3xl p-6 h-[200px] flex flex-col items-center justify-center gap-4 text-center border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
            >
              <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </span>
              <h3 className="font-bold text-secondary group-hover:text-accent transition-colors">
                {cat.name}
              </h3>

              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-secondary">
                Trending Now
              </h2>
              <p className="text-secondary/60 mt-2">
                Handpicked favorites loving by our community
              </p>
            </div>
            <Link
              to="/products"
              className="text-accent font-semibold hover:gap-2 flex items-center gap-1 transition-all"
            >
              View All Products <FaArrowRight />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-accent/5 -z-10" />

        <div className="max-w-4xl mx-auto text-center mb-16 px-6">
          <h2 className="text-4xl font-bold text-secondary">
            Loved by Thousands
          </h2>
          <p className="text-secondary/60 mt-4 text-lg">
            Real results from real people. Join our community of glow-getters.
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="mt-6 px-8 py-3 bg-white border border-accent/20 text-accent font-bold rounded-full hover:bg-accent hover:text-white transition-all shadow-md"
          >
            ✍️ Write a Review
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="relative w-full">
            <div className="flex gap-6 animate-marquee w-max px-6">
              {[...reviews, ...reviews].map((review, i) => (
                <div
                  key={i}
                  className="w-[350px] glass-card p-8 rounded-2xl relative flex-shrink-0"
                >
                  <FaQuoteLeft className="text-4xl text-accent/20 absolute top-6 left-6" />
                  <p className="text-secondary/80 italic mb-6 relative z-10 mt-4 leading-relaxed">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center font-bold text-accent">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">
                        {review.name}
                      </h4>
                      <div className="flex text-amber-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? "" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 opacity-60">
            No reviews yet. Be the first!
          </div>
        )}
      </section>

      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Stay in the Loop</h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Subscribe for exclusive offers, beauty tips, and early access to new
            launches.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-secondary focus:outline-none transition-all"
            />
            <button className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-accent/50 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-secondary p-12 lg:p-16 border-t border-white/10 text-white/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <img
              src="/logo.png"
              className="h-12 w-auto brightness-0 invert opacity-80"
              alt="Logo"
            />
            <p className="text-sm leading-relaxed">
              Premium beauty products for the modern lifestyle. Quality you can
              trust.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:text-accent transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-accent transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-accent transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-accent transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-accent transition-colors"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm">
          &copy; {new Date().getFullYear()} Crystal Beauty Clear. All rights
          reserved.
        </div>
      </footer>

      {showReviewModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReviewModal(false);
          }}
        >
          <div className="glass-card bg-white w-full max-w-lg p-8 rounded-3xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-secondary/40 hover:text-secondary transition-colors text-2xl"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-2 text-secondary">
              Share Your Experience
            </h3>
            <p className="text-secondary/60 mb-6">
              How was your product? Let us know!
            </p>

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
                  .post(`${import.meta.env.VITE_API_URL}/api/reviews`, review)
                  .then((res) => {
                    toast.success("Thank you for your review!");
                    setReviews([res.data.review, ...reviews]);
                    e.target.reset();
                    setShowReviewModal(false);
                  })
                  .catch(() => toast.error("Failed to submit review"));
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  required
                  placeholder="Your Name"
                  className="input-field"
                />
                <select name="rating" required className="input-field">
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
                placeholder="Your thoughts..."
                className="input-field min-h-[120px] resize-none"
              ></textarea>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 btn-primary">
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-6 py-3 rounded-full border border-secondary/20 text-secondary font-semibold hover:bg-secondary/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 1s ease-out forwards;
                }
            `}</style>
    </div>
  );
}
