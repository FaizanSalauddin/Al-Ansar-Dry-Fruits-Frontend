import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  // ✅ Sirf localStorage se data lo, Context ki zarurat nahi hai yahan
  const order = JSON.parse(localStorage.getItem("lastOrder"));

  useEffect(() => {
    // Agar order data nahi hai toh redirect kar do
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">

        {/* ✅ SUCCESS HEADER */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-4xl text-green-600">✔</span>
          </div>

          <h1 className="text-2xl font-bold text-green-700">
            Order Confirmed
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Thank you for shopping with Al-Ansar 🌿
          </p>
          <p className="text-xs text-gray-400 mt-2">Order ID: {order._id}</p>
        </div>

        {/* 📍 DELIVERY & PAYMENT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1 text-sm">Delivery Address</h3>
            <p className="text-sm text-gray-700">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.address}, {order.shippingAddress.city}<br />
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-sm mt-1">📞 {order.shippingAddress.phone}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1 text-sm">Payment Details</h3>
            <p className="text-sm text-gray-700">
              Method: <span className="uppercase font-medium">{order.paymentMethod}</span>
            </p>
            {/* ✅ Online Payment ke liye Transaction ID dikhao */}
            {order.paymentMethod === "online" && order.paymentResult && (
              <p className="text-xs text-blue-600 mt-1 break-all">
                Transaction ID: {order.paymentResult.id}
              </p>
            )}
            <p className={`text-sm mt-1 font-bold ${order.isPaid ? "text-green-600" : "text-orange-500"}`}>
              Status: {order.isPaid ? "PAID" : "Pending (COD)"}
            </p>
          </div>
        </div>

        {/* 🚚 DELIVERY INFO */}
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm mb-6">
          🚚 Expected delivery by{" "}
          <b>
            {order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate).toDateString()
              : "3-4 Business Days"}
          </b>
        </div>

        {/* 📦 ORDERED PRODUCTS */}
        <h3 className="font-semibold mb-3">
          Order Summary ({order.orderItems?.length || 0} items)
        </h3>

        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
          {order.orderItems?.map((item, index) => (
            <div
              key={item.product || index}
              className="flex gap-4 border rounded-lg p-3"
            >
              <img
                src={item.image || "/no-image.png"}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
              />

              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>

              <p className="font-semibold text-sm">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* 💰 PRICE DETAILS */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items Total</span>
            <span>₹{order.itemsPrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className={order.shippingPrice === 0 ? "text-green-600 font-medium" : ""}>
              {order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Amount</span>
            <span className="text-[#2F4F3E]">₹{order.totalPrice}</span>
          </div>
        </div>

        {/* 🔘 ACTION */}
        <button
          onClick={() => {
            localStorage.removeItem("lastOrder"); // Cleanup after user is done
            navigate("/products");
          }}
          className="mt-6 w-full bg-[#2F4F3E] text-white py-3 rounded-lg hover:bg-[#243C30] transition-colors font-bold"
        >
          Continue Shopping
        </button>

      </div>
    </div>
  );
}

export default OrderSuccess;