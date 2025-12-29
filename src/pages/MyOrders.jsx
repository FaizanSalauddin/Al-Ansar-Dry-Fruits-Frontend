import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLoader } from "../context/LoaderContext";

function MyOrders() {
  const { setLoading } = useLoader();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders/myorders");
        setOrders(data.orders);
      } catch (err) {
        console.error("Orders fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setLoading]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-[#2F4F3E]">
          No orders yet
        </h2>
        <Link
          to="/products"
          className="mt-4 bg-[#2F4F3E] text-white px-6 py-3 rounded-lg"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#2F4F3E] mb-6">
          My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>
                  <p className="font-medium">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold text-[#2F4F3E]">
                  ₹{order.totalPrice}
                </p>

                <Link
                  to={`/orders/${order._id}`}
                  className="text-sm text-green-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
