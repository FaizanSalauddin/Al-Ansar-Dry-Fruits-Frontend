import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../api/userApi";
import { useLoader } from "../context/LoaderContext";

function MyOrders() {
  const { setLoading } = useLoader();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await userApi.get("/orders/myorders");
        setOrders(data.orders || []);
      } catch (err) {
        console.error("My orders error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setLoading]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
        <p className="text-gray-600">No orders placed yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#2F4F3E]">
          My Orders
        </h1>

        {orders.map((order) => {
          const firstItem = order.orderItems[0];

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-4 sm:p-6"
            >
              {/* TOP */}
              <div className="flex gap-4 items-start">
                {/* IMAGE */}
                <img
                  src={
                    firstItem?.image
                      ? firstItem.image
                      : "https://via.placeholder.com/150"
                  }
                  alt={firstItem?.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />


                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-semibold text-[#2F4F3E]">
                    {firstItem?.name}
                    {order.orderItems.length > 1 &&
                      ` + ${order.orderItems.length - 1} more`}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Order ID: {order._id.slice(-8)}
                  </p>

                  <p className="text-sm text-gray-500">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold
                    ${order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.orderStatus === "out-for-delivery"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {order.orderStatus || "Placed"}
                </span>
              </div>

              {/* DIVIDER */}
              <hr className="my-4" />

              {/* FOOTER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-semibold text-sm">
                  Total Paid: ₹{order.totalPrice}
                </p>

                <Link
                  to={`/orders/${order._id}`}
                  className="inline-block text-center border border-[#2F4F3E] text-[#2F4F3E] px-4 py-2 rounded-lg hover:bg-[#2F4F3E] hover:text-white transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
