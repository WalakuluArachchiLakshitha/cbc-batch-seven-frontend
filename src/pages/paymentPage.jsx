import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const PAYMENT_TIMEOUT_SECONDS = 5 * 60;

function detectCard(num) {
  if (num.startsWith("4"))
    return { type: "Visa", color: "from-blue-800 to-blue-600", symbol: "VISA" };
  if (num.startsWith("5"))
    return {
      type: "Mastercard",
      color: "from-red-700 to-orange-500",
      symbol: "MC",
    };
  if (num.startsWith("3"))
    return {
      type: "Amex",
      color: "from-green-700 to-teal-600",
      symbol: "AMEX",
    };
  return {
    type: "Card",
    color: "from-secondary to-secondary/70",
    symbol: "CARD",
  };
}

function formatCardDisplay(val) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_TIMEOUT_SECONDS);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [step, setStep] = useState("form");

  const card = detectCard(cardNumber.replace(/\s/g, ""));
  const isFormValid =
    cardNumber.replace(/\s/g, "").length >= 16 &&
    cardName.trim().length >= 2 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  useEffect(() => {
    if (!order) {
      toast.error("No order found. Please start from cart.");
      navigate("/cart");
      return;
    }
    if (order?.paymentExpiresAt) {
      const expiresAt = new Date(order.paymentExpiresAt).getTime();
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setExpired(true);
        return;
      }
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [order, navigate]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerColor =
    secondsLeft <= 60
      ? "text-red-500"
      : secondsLeft <= 120
        ? "text-amber-500"
        : "text-green-600";
  const progressPct = (secondsLeft / PAYMENT_TIMEOUT_SECONDS) * 100;

  async function handlePay() {
    if (!isFormValid) return;
    setPaying(true);
    setStep("processing");

    await new Promise((r) => setTimeout(r, 2500));

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/orders/demo-pay",
        { orderID: order.orderID },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      clearInterval(intervalRef.current);
      setStep("success");
    } catch {
      setStep("failed");
    } finally {
      setPaying(false);
    }
  }

  if (!order) return null;

  if (step === "success") {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/10 p-8 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600">
            Payment Successful!
          </h2>
          <p className="text-secondary/60 text-sm">
            Your order{" "}
            <span className="font-mono font-bold text-secondary">
              {order.orderID}
            </span>{" "}
            has been confirmed. Total charged:{" "}
            <span className="font-bold text-accent">
              LKR {(order.total ?? 0).toFixed(2)}
            </span>
          </p>
          <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
            ✅ Payment processed · Order is now <strong>Processing</strong>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="w-full mt-2 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/80 transition shadow"
          >
            View My Orders →
          </button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/10 p-10 flex flex-col items-center text-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary">
              Processing Payment
            </h2>
            <p className="text-secondary/60 text-sm mt-1">
              Please do not close this window...
            </p>
          </div>
          <div className="w-full space-y-2">
            {[
              "Verifying card details",
              "Contacting bank",
              "Authorising transaction",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-secondary/70"
              >
                <div
                  className="w-4 h-4 rounded-full bg-accent/20 border-2 border-accent animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                {step}...
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/10 p-8 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
          <p className="text-secondary/60 text-sm">
            Something went wrong. You can try again.
          </p>
          <button
            onClick={() => setStep("form")}
            className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/80 transition shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary/10 p-8 flex flex-col items-center text-center gap-4">
          <div className="text-6xl">⏰</div>
          <h2 className="text-2xl font-bold text-red-600">
            Payment Window Expired
          </h2>
          <p className="text-secondary/60 text-sm">
            Order <strong>{order.orderID}</strong> was automatically cancelled
            and stock restored.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/80 transition shadow"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-primary flex flex-col items-center justify-center py-8 px-4 mt-25">
      <div className="w-full max-w-[480px] flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-secondary/10 shadow-sm px-5 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-secondary/60 font-medium">
              Complete payment within:
            </span>
            <span className={`font-mono text-xl font-bold ${timerColor}`}>
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
          </div>
          <div className="w-full h-1.5 bg-secondary/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${secondsLeft <= 60 ? "bg-red-500" : secondsLeft <= 120 ? "bg-amber-400" : "bg-green-500"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div
          className={`relative w-full h-48 rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-xl text-white overflow-hidden`}
        >
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-10 w-48 h-48 rounded-full bg-white/5" />

          <div className="w-10 h-7 bg-yellow-300/80 rounded-md mb-4 grid grid-cols-3 grid-rows-3 gap-px p-1">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-yellow-500/40 rounded-sm" />
              ))}
          </div>

          <div className="font-mono text-xl tracking-widest mb-3 text-white/90">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/50 text-xs uppercase">Card Holder</div>
              <div className="font-semibold text-sm uppercase tracking-wide truncate max-w-[180px]">
                {cardName || "YOUR NAME"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/50 text-xs uppercase">Expires</div>
              <div className="font-semibold text-sm">{expiry || "MM/YY"}</div>
            </div>
            <div className="text-2xl font-black tracking-tighter opacity-80">
              {card.symbol}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-secondary/10 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-secondary/10">
            <div>
              <h1 className="font-bold text-secondary text-base">
                Secure Payment
              </h1>
              <p className="text-xs text-secondary/50">
                Crystal Beauty Clear — {order.orderID}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-secondary/50">Total</div>
              <div className="font-bold text-accent text-lg">
                LKR {(order.total ?? 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                Card Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardDisplay(e.target.value))
                }
                className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 font-mono text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
              <p className="text-xs text-secondary/40 ml-1">
                Demo: use any 16 digits e.g. 4111 1111 1111 1111
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                  Expiry
                </label>
                <input
                  type="tel"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                    setExpiry(v);
                  }}
                  className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wide">
                  CVV
                </label>
                <input
                  type="tel"
                  placeholder="•••"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-secondary/20 bg-primary/40 rounded-xl px-4 py-2.5 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!isFormValid || paying}
              className={`w-full mt-1 py-3.5 font-bold rounded-xl text-white transition shadow-lg flex items-center justify-center gap-2 ${
                isFormValid
                  ? "bg-accent hover:bg-accent/80 active:scale-95"
                  : "bg-secondary/30 cursor-not-allowed"
              }`}
            >
              <span>🔒</span>
              Pay LKR {(order.total ?? 0).toFixed(2)}
            </button>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-700">
              <span className="shrink-0 mt-0.5">🧪</span>
              <span>
                <strong>Demo Mode</strong> — No real money is charged. Use any
                valid-format card numbers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
