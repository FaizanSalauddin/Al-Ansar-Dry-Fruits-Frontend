import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import userApi from "../api/userApi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";

function PlaceOrder() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  const shipping = JSON.parse(
    localStorage.getItem("shippingAddress")
  );

  // 🔐 SAFETY CHECKS
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate("/cart");
      return;
    }

    if (!shipping) {
      navigate("/checkout");
    }
  }, [cart, shipping, navigate]);

  if (!cart || !shipping) return null;

  // 💰 PRICE CALCULATION (SAME AS BACKEND)
  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice >= 1000 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrder = async () => {
    try {
      const payload = {
        name: shipping.name,
        address: shipping.addressLine, // 🔥 FIX HERE
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
        phone: shipping.phone,
      };

      await userApi.post("/orders/from-cart", {
        shippingAddress: payload,
        paymentMethod: "cod",
      });

      toast.success("Order placed successfully 🎉");
      localStorage.removeItem("shippingAddress");
      fetchCart();
      navigate("/home");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Order failed"
      );
    }
  };



  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-10 text-center">
          Payment
        </h2>
        <CheckoutSteps currentStep="payment" />

        {/* 📦 SHIPPING */}
        <div className="text-sm text-gray-900 mb-4 border rounded-lg p-3">
          <p className="font-semibold mb-1">Delivery Address</p>
          <p>
            {shipping.name}, {shipping.addressLine}, {shipping.city},{" "}
            {shipping.state} - {shipping.pincode}
          </p>
          <p className="mt-1">📞 {shipping.phone}</p>
        </div>

        {/* 💰 PRICE SUMMARY */}
        <div className="border rounded-lg p-3 mb-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Items Price</span>
            <span>₹{itemsPrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{shippingPrice === 0 ? "FREE" : "₹50"}</span>
          </div>

          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <button
          onClick={placeOrder}
          className="w-full bg-[#2F4F3E] text-white text-lg font-bold py-3 rounded-lg hover:bg-[#244235]"
        >
          Place Order (Cash on Delivery)
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 border py-2 rounded-lg text-lg hover:bg-[#57816b] bg-[#2F4F3E] text-white font-bold "
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default PlaceOrder;
