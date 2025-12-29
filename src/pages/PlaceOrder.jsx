import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function PlaceOrder() {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const shipping = JSON.parse(localStorage.getItem("shippingAddress"));

  const placeOrder = async () => {
    try {
      await api.post("/orders/from-cart", {
        shippingAddress: shipping,
        paymentMethod: "cod",
      });

      toast.success("Order placed successfully 🎉");
      fetchCart();
      navigate("/home");
    } catch (err) {
      toast.error("Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#2F4F3E]">
          Ready to Place Order?
        </h2>

        <button
          onClick={placeOrder}
          className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg"
        >
          Place Order (COD)
        </button>
      </div>
    </div>
  );
}

export default PlaceOrder;
