import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state || [];

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/orders",
        {
          customerName,
          phone,
          address,
          items: cart.map((item) => ({
            productID: item.productID,
            quantity: item.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order placed! Proceed to payment.");
      navigate("/payment", { state: { order: res.data.order } });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place order.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex items-center justify-center px-4 ">
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">🛒</span>
          <h2 className="text-2xl font-bold text-secondary">
            Your cart is empty
          </h2>
          <p className="text-secondary/60 text-sm">
            Add some products before checking out.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/80 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex flex-col items-center py-10 px-4 mt-20">
      <div className="w-full max-w-[900px] flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-secondary/10 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-secondary border-b border-secondary/10 pb-3">
            Order Summary
          </h2>
          <div className="flex flex-col gap-3">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl border border-secondary/10"
                />
                <div className="flex-1">
                  <p className="font-semibold text-secondary text-sm">
                    {item.name}
                  </p>
                  <p className="text-secondary/50 text-xs">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-accent text-sm">
                  LKR {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-secondary/10 pt-3 flex justify-between items-center">
            <span className="font-semibold text-secondary">Total</span>
            <span className="font-bold text-accent text-xl">
              LKR {total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-secondary/10 p-6">
          <h2 className="text-lg font-bold text-secondary border-b border-secondary/10 pb-3 mb-5">
            Shipping Details
          </h2>
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 0771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter your full delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3.5 font-bold rounded-xl text-white transition shadow-lg flex items-center justify-center gap-2 ${
                loading
                  ? "bg-secondary/30 cursor-not-allowed"
                  : "bg-accent hover:bg-accent/80 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>🛍️ Place Order — LKR {total.toFixed(2)}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
