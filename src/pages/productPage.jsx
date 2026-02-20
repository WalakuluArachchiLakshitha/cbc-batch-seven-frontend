import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function ProductPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // keep original data
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { category } = useParams();

  // Load all products
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/products")
      .then((response) => {
        setProducts(response.data);
        setAllProducts(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to load products");
      });
  }, []);

  // Handle category from URL
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

  // Categories list
  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

  // Filter products by category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // 🔍 Search Function
  const handleSearch = async (e) => {
    const value = e.target.value;

    try {
      if (value.trim() === "") {
        setProducts(allProducts);
        return;
      }

      const searchResults = await axios.get(
        import.meta.env.VITE_API_URL + "/api/products/search/" + value,
      );

      setProducts(searchResults.data);
    } catch {
      toast.error("Search is currently unavailable");
    }
  };

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
            <h1 className="text-3xl font-bold text-secondary mb-2 text-center">
              Our Collection
            </h1>

            {/* 🔍 Search Box */}
            <div className="w-full h-[100px] flex justify-center items-center mb-2">
              <input
                type="text"
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-3/4 px-4 py-2 rounded-full border border-secondary/20 bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            {/* ✅ Mobile Dropdown */}
            <div className="md:hidden flex justify-center">
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Desktop Buttons */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold 
                  transition-all border ${selectedCategory === cat
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-secondary border-secondary/20 hover:border-accent hover:text-accent"
                    }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
