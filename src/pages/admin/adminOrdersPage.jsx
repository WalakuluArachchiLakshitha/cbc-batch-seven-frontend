import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";
import OrderModal from "../../components/orderInfoModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      if (token == null) {
        navigate("/login");
        return;
      }
      axios
        .get(import.meta.env.VITE_API_URL + "/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setOrders(response.data);
          setIsLoading(false);
        });
    }
  }, [isLoading, navigate]);

  return (
    <div className="w-full min-h-full">
      <OrderModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        selectedOrder={selectedOrder}
        refresh={() => {
          setIsLoading(true);
        }}
      />

      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">
            <h1 className="text-lg font-semibold text-secondary">Orders</h1>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {orders.length} orders
            </span>
          </div>

          <div className="p-0">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[880px] text-left">
                    <thead className="bg-secondary text-white">
                      <tr>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Order ID
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Number of Items
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Customer Name
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Email
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Phone
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Address
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                          Total
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">
                          Status
                        </th>
                        <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-secondary/10">
                      {orders.map((item) => {
                        return (
                          <tr
                            key={item.orderID}
                            className="odd:bg-white even:bg-primary hover:bg-accent/5 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedOrder(item);
                              setIsModalOpen(true);
                            }}
                          >
                            <td className="px-4 py-3 font-mono text-sm text-secondary/80">
                              {item.orderID}
                            </td>
                            <td className="px-4 py-3 font-medium text-secondary">
                              {item.items.length} items
                            </td>
                            <td className="px-4 py-3 font-medium text-secondary">
                              {item.customerName}
                            </td>
                            <td className="px-4 py-3 font-medium text-secondary">
                              {item.email}
                            </td>
                            <td className="px-4 py-3 text-secondary/70">
                              {item.phone}
                            </td>
                            <td className="px-4 py-3">{item.address}</td>
                            <td className="px-4 py-3">
                              {`LKR ${item.total.toFixed(2)}`}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize
															${
                                item.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : item.status === "processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.status === "shipped"
                                      ? "bg-indigo-100 text-indigo-700"
                                      : item.status === "delivered"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                              }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td
                            className="px-4 py-12 text-center text-secondary/60"
                            colSpan={7}
                          >
                            No orders to display.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden flex flex-col gap-4 p-4">
                  {orders.map((item) => (
                    <div
                      key={item.orderID}
                      onClick={() => {
                        setSelectedOrder(item);
                        setIsModalOpen(true);
                      }}
                      className="bg-white rounded-xl shadow-sm border border-secondary/10 p-4 flex flex-col gap-3 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-secondary/60 block mb-1">
                            #{item.orderID}
                          </span>
                          <h3 className="font-semibold text-secondary">
                            {item.customerName}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize 
												${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "shipped"
                                ? "bg-indigo-100 text-indigo-700"
                                : item.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                        }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-secondary/70 border-t border-secondary/10 pt-2 mt-2">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-secondary/30"></span>
                        <span>{item.items.length} items</span>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-secondary/60">
                          {item.email}
                        </span>
                        <span className="font-bold text-accent text-lg">
                          LKR {item.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-10 text-secondary/60">
                      No orders to display.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
