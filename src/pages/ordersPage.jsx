import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";

const formatLKR = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
    n ?? 0,
  );

const statusConfig = {
  pending: {
    label: "Pending Payment",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  canceled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  refunded: {
    label: "Refunded",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },

  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  failed: {
    label: "Payment Failed",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[(status || "").toLowerCase()] ?? {
    label: status,
    color: "bg-secondary/10 text-secondary border-secondary/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

function OrderRow({ order, onExpand }) {
  return (
    <div
      className="w-full bg-white rounded-2xl border border-secondary/10 shadow-sm hover:shadow-md hover:border-accent/30 transition-all cursor-pointer mt-"
      onClick={() => onExpand(order)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-semibold text-secondary">
              {order.orderID}
            </span>

            <StatusBadge status={order.status} />
          </div>
          <div className="text-xs text-secondary/50 mt-1">
            {new Date(order.date).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-xs text-secondary/50">Items</div>
            <div className="font-semibold text-secondary">
              {order.items?.length ?? 0}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-secondary/50">Total</div>
            <div className="font-bold text-accent">
              {formatLKR(order.total)}
            </div>
          </div>
          <div className="text-secondary/40 text-lg">›</div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[92vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-secondary/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-secondary/10 px-6 py-4 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-secondary">
              Order {order.orderID}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={order.status} />
              <span className="text-xs text-secondary/50">
                {new Date(order.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-secondary/10 px-2.5 py-1.5 text-secondary/70 hover:bg-accent/10 hover:text-secondary transition"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary/60 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-3">
                Delivery Info
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary/60">Name</dt>
                  <dd className="font-medium text-secondary">
                    {order.customerName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary/60">Phone</dt>
                  <dd className="font-medium text-secondary">{order.phone}</dd>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-secondary/60 shrink-0">Address</dt>
                  <dd className="font-medium text-secondary text-right">
                    {order.address}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl bg-primary/60 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary/60 mb-3">
                Payment Summary
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary/60">Items</dt>
                  <dd className="font-medium text-secondary">
                    {order.items?.length ?? 0}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary/60">Order Total</dt>
                  <dd className="font-bold text-accent">
                    {formatLKR(order.total)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary/60">Payment</dt>
                  <dd>
                    <StatusBadge status={order.paymentStatus} />
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-xl border border-secondary/10 overflow-hidden">
            <div className="bg-secondary text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">
              Order Items
            </div>
            <ul className="divide-y divide-secondary/10">
              {order.items?.map((item) => (
                <li
                  key={item.productID}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover border border-secondary/10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-secondary/50 font-mono">
                      PID: {item.productID}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-secondary/60">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-semibold text-secondary">
                      {formatLKR(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(import.meta.env.VITE_API_URL + "/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-primary py-8 px-4 mt-20">
      <OrderDetailModal
        order={expandedOrder}
        onClose={() => setExpandedOrder(null)}
      />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary">My Orders</h1>
            <p className="text-sm text-secondary/60 mt-0.5">
              Track and view all your orders
            </p>
          </div>
          {!isLoading && (
            <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent/20">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="text-6xl">🛍️</div>
            <h2 className="text-xl font-semibold text-secondary">
              No orders yet
            </h2>
            <p className="text-secondary/60 text-sm">
              Start shopping and your orders will appear here.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-2 px-6 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent/80 transition shadow"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderRow
                key={order.orderID}
                order={order}
                onExpand={setExpandedOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
