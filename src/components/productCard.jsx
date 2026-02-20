import { Link } from "react-router-dom";
import { BsCartPlus, BsEye } from "react-icons/bs";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const isOutOfStock = product.stock === 0;

  const _handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success("Added to cart");
  };

  return (
    <Link
      to={"/overview/" + product.productID}
      className="group relative w-full max-w-[320px] bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-secondary/5"
    >
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            isOutOfStock ? "opacity-60 grayscale" : ""
          }`}
          src={product.image[0]}
          loading="lazy"
          alt={product.name}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Actions (Hover) */}
        {!isOutOfStock && (
          <div
            className="absolute bottom-4 left-0 w-full 
                  hidden md:flex 
                  justify-center gap-3 
                  translate-y-10 group-hover:translate-y-0 
                  transition-transform duration-300"
          >
            {/* <button
              onClick={handleAddToCart}
              className="bg-white text-secondary hover:text-accent 
                 p-3 rounded-full shadow-lg 
                 hover:scale-110 transition-all"
              title="Add to Cart"
            >
              <BsCartPlus size={20} />
            </button> */}

            {/* <div
              className="bg-accent text-white p-3 rounded-full 
                    shadow-lg hover:scale-110 transition-all"
            >
              <BsEye size={20} />
            </div> */}
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 animate-pulse">
              Low Stock: {product.stock}
            </span>
          ) : null}
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col gap-2">
        <div className="text-sm text-secondary/50 uppercase tracking-wider font-semibold">
          {product.category || "Beauty"}
        </div>

        <h3 className="text-lg font-bold text-secondary line-clamp-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            {product.labelPrice > product.price && (
              <span className="text-xs text-secondary/40 line-through">
                LKR {product.labelPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold text-accent">
              LKR {product.price.toFixed(2)}
            </span>
          </div>

          {!isOutOfStock && (
            <span className="text-xs font-semibold text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
              Buy Now
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
