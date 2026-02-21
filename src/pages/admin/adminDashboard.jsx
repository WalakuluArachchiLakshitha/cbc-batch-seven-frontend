import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "../../components/loader";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="text-3xl" />,
      bg: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <FaBoxOpen className="text-3xl" />,
      bg: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <FaShoppingCart className="text-3xl" />,
      bg: "from-amber-500 to-amber-600",
    },
    {
      title: "Total Revenue",
      value: `LKR ${(stats?.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <FaMoneyBillWave className="text-3xl" />,
      bg: "from-purple-500 to-purple-600",
    },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="w-full min-h-full">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
          <p className="text-secondary/60 mt-1">
            Welcome back! Here's your store overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bg} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-secondary">
              Recent Orders
            </h2>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Last 5
            </span>
          </div>

          <div className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      Total
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-center">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {stats?.recentOrders?.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr
                        key={order.orderID}
                        className="odd:bg-white even:bg-primary hover:bg-accent/5 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-sm text-secondary/80">
                          {order.orderID}
                        </td>
                        <td className="px-4 py-3 font-medium text-secondary">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-3 text-secondary/70">
                          {order.email}
                        </td>
                        <td className="px-4 py-3 font-medium text-secondary">
                          LKR {order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-secondary/70">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-4 py-12 text-center text-secondary/60"
                        colSpan={6}
                      >
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-4 p-4">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.orderID}
                    className="bg-white p-4 rounded-xl shadow-sm border border-secondary/10 flex flex-col gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-secondary/60 block mb-1">
                          #{order.orderID}
                        </span>
                        <h3 className="font-semibold text-secondary">
                          {order.customerName}
                        </h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary/70">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-accent">
                        LKR {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-secondary/60">
                  No orders yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
