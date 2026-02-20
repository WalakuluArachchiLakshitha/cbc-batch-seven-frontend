import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { category } = useParams();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/products")
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
        toast.error("Failed to load products");
      });
  }, []);

  useEffect(() => {
    if (category) {
      if (category.toLowerCase() === "all") {
        setSelectedCategory("All");
      } else {
        setSelectedCategory(category.toLowerCase());
      }
    } else {
      setSelectedCategory("All");
    }
  }, [category]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex flex-col items-center pt-8 mt-20">
      <Helmet>
        <title>Shop All Products - Cosmetic Shop</title>
        <meta
          name="description"
          content="Browse our extensive collection of premium cosmetic products."
        />
      </Helmet>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Category Filter */}
          <div className="w-full max-w-7xl px-4 mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-6 text-center">
              Our Collection
            </h1>

            {/* ✅ Mobile Dropdown */}
         
            <div className="block md:hidden flex justify-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-72 max-w-full px-4 py-3 rounded-full
               border border-secondary/20
               bg-white text-secondary font-semibold
               shadow-sm
               focus:outline-none focus:ring-2 focus:ring-accent/40
               focus:border-accent transition"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Desktop Buttons */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold 
          transition-all border ${
            selectedCategory === category
              ? "bg-accent text-white border-accent"
              : "bg-white text-secondary border-secondary/20 hover:border-accent hover:text-accent"
          }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full max-w-7xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div key={item.productID} className="flex justify-center">
                  <ProductCard product={item} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-secondary/60">
                <p className="text-xl">No products found in this category.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
