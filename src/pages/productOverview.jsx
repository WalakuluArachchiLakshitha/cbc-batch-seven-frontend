import axios from "axios";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart } from "../utils/cart";

export default function ProductOverview() {
  const params = useParams();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const slideInterval = useRef(null);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
      })
      .catch(() => {
        toast.error("Failed to fetch product details");
        setStatus("error");
      });
  }, [params.id]);

  // Auto-slide reviews every 4 seconds
  useEffect(() => {
    if (product && product.reviews && product.reviews.length > 1) {
      slideInterval.current = setInterval(() => {
        setCurrentReviewIndex((prev) =>
          prev === product.reviews.length - 1 ? 0 : prev + 1,
        );
      }, 4000);
    }
    return () => clearInterval(slideInterval.current);
  }, [product]);

  const handleDotClick = (index) => {
    setCurrentReviewIndex(index);
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentReviewIndex((prev) =>
        prev === product.reviews.length - 1 ? 0 : prev + 1,
      );
    }, 4000);
  };

  const reversedReviews =
    product && product.reviews ? [...product.reviews].reverse() : [];

  return (
    <div className="w-full lg:h-[calc(100vh-100px)] text-secondary bg-primary overflow-y-auto mt-24 lg:mt-30 pt-4 lg:pt-0">
      {status == "loading" && <Loader />}
      {status == "success" && (
        <div className="flex flex-col">
          <div className="w-full flex flex-col lg:flex-row p-4 lg:p-10">
            <h1 className="text-2xl font-bold text-center lg:hidden mb-6">
              {product.name}
            </h1>
            <div className="w-full lg:w-[50%] h-full flex justify-center items-center">
              <ImageSlider images={product.image} />
            </div>
            <div className="w-full lg:w-[50%] h-full flex flex-col bg-primary items-center gap-4 p-4 lg:p-10">
              <span className="">{product.productID}</span>
              <h1 className="hidden lg:block text-2xl font-bold text-center">
                {product.name}
                {product.altNames.map((name, index) => {
                  return (
                    <span key={index} className="font-normal text-secondary">
                      {" | " + name}
                    </span>
                  );
                })}
              </h1>
              {/* description */}
              <p className="mt-[30px] text-justify">{product.description}</p>
              {/* category */}
              <p>Category: {product.category}</p>
              {/* price */}
              {product.labelPrice > product.price ? (
                <div className="flex gap-3 items-center">
                  <p className="text-lg text-secondary font-semibold line-through">
                    LKR {product.labelPrice.toFixed(2)}
                  </p>
                  <p className="text-lg text-accent font-semibold">
                    LKR {product.price.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-lg text-accent font-semibold">
                  LKR {product.price.toFixed(2)}
                </p>
              )}
              <div className="w-full h-auto sm:h-[50px] flex flex-col sm:flex-row gap-4 mt-[40px] lg:mt-[60px]">
                <button
                  className="w-full sm:w-[50%] h-[50px] sm:h-full 
               bg-accent text-white font-semibold 
               hover:bg-accent/80 transition-colors rounded-lg"
                  onClick={() => {
                    addToCart(product, 1);
                    toast.success("Added to cart");
                  }}
                >
                  Add to Cart
                </button>

                <Link
                  to="/checkout"
                  state={[
                    {
                      image: product.image[0],
                      productID: product.productID,
                      name: product.name,
                      price: product.price,
                      labelPrice: product.labelPrice,
                      quantity: 1,
                    },
                  ]}
                  className="w-full sm:w-[50%] h-[50px] sm:h-full 
               flex justify-center items-center text-center
               border border-accent text-accent font-semibold 
               hover:bg-accent hover:text-white 
               transition-colors rounded-lg"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="w-full p-10 flex flex-col items-center border-t border-secondary/20">
            <div className="w-full lg:w-[80%] flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary">
                Customer Reviews
              </h2>
              {/* Button to open Write a Review popup */}
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-accent text-white px-5 py-2 rounded font-semibold hover:bg-accent/80 transition-all duration-200 shadow-md"
              >
                ✍️ Write a Review
              </button>
            </div>

            {/* Auto-sliding Reviews Display */}
            {reversedReviews.length > 0 ? (
              <div className="w-full lg:w-[80%]">
                {/* Sliding Review Card */}
                <div className="relative overflow-hidden rounded-lg">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentReviewIndex * 100}%)`,
                    }}
                  >
                    {reversedReviews.map((review, index) => (
                      <div
                        key={index}
                        className="min-w-full bg-white p-6 rounded-lg border border-secondary/10 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-lg block">
                              {review.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-yellow-500 text-lg">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dot Navigation */}
                {reversedReviews.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {reversedReviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentReviewIndex
                            ? "bg-accent scale-125"
                            : "bg-secondary/30 hover:bg-accent/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Review count */}
                <p className="text-center text-sm text-gray-400 mt-3">
                  {currentReviewIndex + 1} / {reversedReviews.length} reviews
                </p>
              </div>
            ) : (
              <div className="w-full lg:w-[80%] text-center py-10">
                <p className="text-gray-500 mb-4">
                  No reviews yet. Be the first to review!
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-accent text-white px-6 py-2 rounded font-semibold hover:bg-accent/80"
                >
                  Write the First Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {status == "error" && (
        <h1 className="text-red-500">Failed to load product details</h1>
      )}

      {/* ===== REVIEW POPUP MODAL ===== */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReviewModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-6 text-secondary">
              Write a Review
            </h3>

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
                    `${import.meta.env.VITE_API_URL}/api/products/${product.productID}/reviews`,
                    review,
                  )
                  .then((res) => {
                    toast.success("Review submitted successfully!");
                    setProduct({ ...product, reviews: res.data.reviews });
                    setCurrentReviewIndex(0); // Go to newest review
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
                placeholder="Share your experience with this product..."
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
