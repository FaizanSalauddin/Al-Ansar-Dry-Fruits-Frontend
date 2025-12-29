import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useLoader } from "../context/LoaderContext";

function OrderDetail() {
  const { id } = useParams();
  const { setLoading } = useLoader();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error("Order detail error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, setLoading]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-[#2F4F3E]">
            Order Details
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Order ID: <span className="break-all">{order._id}</span>
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 text-sm rounded-full capitalize
              ${
                order.orderStatus === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.orderStatus === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* SHIPPING */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-3 text-[#2F4F3E]">
            Shipping Address
          </h2>

          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} –{" "}
            {order.shippingAddress.pincode}
          </p>
          <p className="mt-1">
            📞 {order.shippingAddress.phone}
          </p>
        </div>

        {/* ITEMS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4 text-[#2F4F3E]">
            Order Items
          </h2>

          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICE SUMMARY */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4 text-[#2F4F3E]">
            Price Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items Price</span>
              <span>₹{order.itemsPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shippingPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.taxPrice}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2 text-[#2F4F3E]">
            Payment
          </h2>

          <p className="text-sm">
            Method:{" "}
            <span className="uppercase font-medium">
              {order.paymentMethod}
            </span>
          </p>

          <p className="text-sm mt-1">
            Status:{" "}
            {order.isPaid ? (
              <span className="text-green-700 font-semibold">
                Paid
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                Pending
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
