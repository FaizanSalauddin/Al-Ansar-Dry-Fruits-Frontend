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

        // ✅ SAFETY: newest first
        const sortedOrders = (data.orders || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
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

  const statusUI = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusEmoji = (status) => {
    switch (status) {
      case "delivered":
        return "✅";
      case "shipped":
        return "🚚";
      case "processing":
        return "⏳";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

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
              className="
                bg-white
                rounded-2xl
                shadow
                p-4 sm:p-6
                transition
                hover:shadow-lg
              "
            >
              {/* TOP */}
              <div className="flex gap-4 items-start">
                {/* IMAGE */}
                <img
                  src={firstItem?.image || "/no-image.png"}
                  alt={firstItem?.name}
                  className="w-20 h-20 rounded-xl object-cover border"
                />



                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-semibold text-[#2F4F3E]">
                    {firstItem?.name}
                    {order.orderItems.length > 1 &&
                      ` + ${order.orderItems.length - 1} more`}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Order ID: #{order._id.slice(-8)}
                  </p>

                  <p className="text-xs text-gray-500">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
})}

                  </p>

                  {/* 🚚 EXPECTED DELIVERY */}
                  {order.estimatedDeliveryDate && (
                    <p className="mt-1 text-sm font-medium text-[#2F4F3E]">
                      🚚 Expected by{" "}
                      <span className="font-semibold">
                        {new Date(order.estimatedDeliveryDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}

                      </span>
                    </p>
                  )}
                </div>


                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusUI(
                    order.orderStatus
                  )}`}
                >
                  {statusEmoji(order.orderStatus)}
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
                  className="
                    inline-block
                    text-center
                    border
                    border-[#2F4F3E]
                    text-[#2F4F3E]
                    px-4 py-2
                    rounded-lg
                    hover:bg-[#2F4F3E]
                    hover:text-white
                    transition
                  "
                >
                  View Details →
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
