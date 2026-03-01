import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PlaceOrder() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { cart, fetchCart } = useCart();
  const shipping = JSON.parse(localStorage.getItem("shippingAddress"));

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // ✅ NEW
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 🔐 SAFETY
  useEffect(() => {
    if (isPlacingOrder) return;

    if (!cart || cart.items.length === 0) {
      navigate("/cart");
      return;
    }

    if (!shipping) {
      navigate("/checkout");
    }
  }, [cart, shipping, navigate, isPlacingOrder]);


  if (!cart || !shipping) return null;

  // 💰 PRICE
  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice >= 1000 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  // 📦 ADDRESS PAYLOAD
  const shippingPayload = {
    name: shipping.name,
    address: shipping.addressLine,
    city: shipping.city,
    state: shipping.state,
    pincode: shipping.pincode,
    phone: shipping.phone,
  };

  // ================= COD =================
  const placeOrderCOD = async () => {
    try {
      setIsPlacingOrder(true);
      setLoading(true);
      const button = document.getElementById("orderBtn");
      button.innerText = "Placing Order...";
      if (button) button.disabled = true;
      const { data } = await userApi.post("/orders/from-cart", {
        shippingAddress: shippingPayload,
        paymentMethod: "cod",
      });

      await fetchCart();
      localStorage.setItem("lastOrder", JSON.stringify(data.order));
      localStorage.removeItem("shippingAddress");

      toast.success("Order placed successfully 🎉");
      navigate("/order-success", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= ONLINE PAYMENT =================
  const payOnline = async () => {
    if (!stripe || !elements) return;

    try {
      setIsPlacingOrder(true);
      setLoading(true);

      const { data } = await userApi.post("/payments/create-intent", {
        amount: totalPrice,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shipping.name,
            phone: shipping.phone,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const { data: orderRes } = await userApi.post("/orders/from-cart", {
          shippingAddress: shippingPayload,
          paymentMethod: "online",
          paymentResult: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: "paid-via-stripe",
          },
        });

        await fetchCart();
        localStorage.setItem("lastOrder", JSON.stringify(orderRes.order));
        localStorage.removeItem("shippingAddress");

        toast.success("Payment Successful 🎉");
        navigate("/order-success", { replace: true });
      }
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

        <CheckoutSteps currentStep="payment" />

        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-4 text-center">
          Select Payment Method
        </h2>

        {/* 🔘 PAYMENT METHOD */}
        <div className="space-y-3 mb-6">
          <label className="flex gap-2 items-center">
            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="radio"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            Pay Online (Card / UPI)
          </label>
        </div>

        {/* 💰 SUMMARY */}
        <div className="border rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between">
            <span>Items</span>
            <span>₹{itemsPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{shippingPrice === 0 ? "FREE" : "₹50"}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* 🟢 COD BUTTON */}
        {paymentMethod === "cod" && (
          <button
            id="orderBtn"
            disabled={loading}
            onClick={placeOrderCOD}
            className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg font-bold"
          >
            Place Order (COD)
          </button>
        )}

        {/* 🔵 ONLINE PAYMENT */}
        {paymentMethod === "online" && (
          <div className="border rounded-lg p-3">
            <CardElement className="border p-2 rounded" />
            <button
              disabled={loading}
              onClick={payOnline}
              className="mt-3 w-full bg-[#2F4F3E] text-white py-3 rounded-lg font-bold"
            >
              Pay ₹{totalPrice}
            </button>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 border py-2 rounded-lg"
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default PlaceOrder;
