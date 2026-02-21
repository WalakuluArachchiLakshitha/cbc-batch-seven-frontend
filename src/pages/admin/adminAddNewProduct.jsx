import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminAddNewProduct() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");
  const [price, setPrice] = useState("");
  const [labelledPrice, setLabelledPrice] = useState("");
  const [category, setCategory] = useState("haircare");
  const [stock, setStock] = useState("");

  async function addProduct() {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/login");
      return;
    }

    if (!productId || !name || !price || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const imageUrls = images
        .split(/[\n,]+/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const alternativeNames = altNames
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const product = {
        productID: productId,
        name,
        altNames: alternativeNames,
        description,
        image: imageUrls,
        price: Number(price),
        labelPrice: Number(labelledPrice) || Number(price),
        category,
        stock: Number(stock),
      };

      await axios.post(
        import.meta.env.VITE_API_URL + "/api/products",
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred";
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen w-full bg-primary/70 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-accent/30 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-accent/20 px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-secondary">
              Add New Product
            </h1>
            <p className="text-sm text-secondary/70">
              Create a new SKU with clean metadata.
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-accent/15 ring-1 ring-accent/30" />
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Product ID <span className="text-red-500">*</span>
              </span>
              <input
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g., DS-CR-001"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Name <span className="text-red-500">*</span>
              </span>
              <input
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Diamond Shine Night Cream"
              />
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-medium text-secondary">
                Alternative Names
              </span>
              <input
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
                value={altNames}
                onChange={(e) => setAltNames(e.target.value)}
                placeholder="Comma-separated; e.g., night cream, hydrating cream"
              />
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-medium text-secondary">
                Description
              </span>
              <textarea
                className="min-h-[120px] rounded-xl border border-secondary/20 bg-white px-3 py-2 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief product overview, benefits, and usage."
              />
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-medium text-secondary">
                Image URLs
              </span>
              <textarea
                className="min-h-[100px] rounded-xl border border-secondary/20 bg-white px-3 py-2 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                placeholder="Paste image URLs here (one per line or comma separated)"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Price <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Labelled Price
              </span>
              <input
                type="number"
                value={labelledPrice}
                onChange={(e) => setLabelledPrice(e.target.value)}
                placeholder="MRP / Sticker Price"
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
              >
                <option value="haircare">Haircare</option>
                <option value="skincare">Skincare</option>
                <option value="watches">Watches</option>
                <option value="jewellery">Jewellery</option>
                <option value="perfumes">Perfumes</option>
                <option value="accessories">Accessories</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Stock <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="h-11 rounded-xl border border-secondary/20 bg-white px-3 text-secondary placeholder:text-secondary/40 outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-accent/20 px-6 py-4">
          <span className="text-xs text-secondary/60">
            Tip: Maintain consistent naming for SKU discoverability.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/products")}
              className="rounded-full bg-[#FF000050] px-3 h-[40px] w-[100px] py-1 text-md flex justify-center items-center font-medium text-secondary ring-1 ring-accent/30 hover:border-red-500 hover:border-[2px]"
            >
              Cancel
            </button>
            <button
              onClick={addProduct}
              className="rounded-full bg-accent/15 px-3 h-[40px] w-[100px] py-1 text-md flex justify-center items-center font-medium text-secondary ring-1 ring-accent/30 hover:border-accent hover:border-[2px]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
