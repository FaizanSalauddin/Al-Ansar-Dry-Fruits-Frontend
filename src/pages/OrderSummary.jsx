import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

function OrderSummary() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const shipping = JSON.parse(
    localStorage.getItem("shippingAddress")
  );

  // ✅ Redirect safely
  useEffect(() => {
    if (!shipping) {
      navigate("/checkout");
    }
  }, [shipping, navigate]);

  if (!cart || cart.items.length === 0) return null;
  if (!shipping) return null;

  // ================= PRICE CALCULATION =================
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const FREE_DELIVERY_LIMIT = 1000;
  const deliveryFee = subtotal >= FREE_DELIVERY_LIMIT ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;
  const remainingForFree = FREE_DELIVERY_LIMIT - subtotal;

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2F4F3E]">
            Order Summary
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#2F4F3E] hover:underline"
          >
            ← Back to Checkout
          </button>
        </div>

        {/* 🔔 FREE DELIVERY INFO */}
        {deliveryFee > 0 ? (
          <div className="mb-5 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
            🛒 Shop for{" "}
            <span className="font-semibold">
              ₹{remainingForFree}
            </span>{" "}
            more to get <b>FREE Delivery</b>!
          </div>
        ) : (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm">
            🎉 Congratulations! You’ve unlocked{" "}
            <b>FREE Delivery</b>.
          </div>
        )}

        {/* SHIPPING INFO */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-700">
            {shipping.name}, {shipping.addressLine}, {shipping.city},{" "}
            {shipping.state} - {shipping.pincode}
            <br />
            <p className="text-sm mt-1">📞 {shipping.phone}</p>
          </p>
        </div>

        {/* ITEMS */}
        <div className="space-y-4 mb-6">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border-b pb-2 text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>
              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {/* ACTION */}
        <button
          onClick={() => navigate("/place-order")}
          className="mt-6 w-full bg-[#2F4F3E] text-white py-3 rounded-lg hover:bg-[#243C30] transition"
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
