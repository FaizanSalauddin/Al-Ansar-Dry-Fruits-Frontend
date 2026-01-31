import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-4">
          Your cart is empty
        </h2>
        <Link
          to="/products"
          className="bg-[#2F4F3E] text-white px-6 py-3 rounded-lg"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  // ================= FREE DELIVERY LOGIC =================
  const FREE_DELIVERY_LIMIT = 1000;
  const subtotal = cart.totalPrice;
  const remainingForFree = FREE_DELIVERY_LIMIT - subtotal;
  const progressPercent = Math.min(
    (subtotal / FREE_DELIVERY_LIMIT) * 100,
    100
  );


  return (

    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2F4F3E] mb-6">
          Your Cart
        </h1>

        <CheckoutSteps currentStep="cart" />

        {/* 🔔 FREE DELIVERY BANNER */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          {subtotal < FREE_DELIVERY_LIMIT ? (
            <>
              <p className="text-sm text-gray-700 mb-2">
                🛒 Shop for{" "}
                <span className="font-semibold text-[#2F4F3E]">
                  ₹{remainingForFree}
                </span>{" "}
                more to get <b>FREE delivery</b>
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2F4F3E] h-2 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-green-700 font-medium mb-2">
                🎉 Congratulations! You’ve unlocked <b>FREE delivery</b>
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-600 h-2"
                  style={{ width: "100%" }}
                />
              </div>
            </>
          )}
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
            >
              <img
                src={item.image || "/no-image.png"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-[#2F4F3E]">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600">
                  ₹{item.price}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    disabled={item.quantity >= 5}
                    onClick={() => increaseQty(item._id)}
                    className={`px-2 py-1 rounded 
                      ${item.quantity >= 5
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 text-white"
                      }`}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="pl-5 
      flex items-center justify-center
      text-red-700 bg-red-100
      px-4 py-1.5 rounded-lg text-sm font-medium
      hover:bg-red-600 hover:text-white
      transition duration-200 ease-in-out
      shadow-sm hover:shadow-md"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-xl shadow p-5 mt-8">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg"
            >
              Proceed to Checkout →
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border bg-[#2c553f] border-[#2F4F3E] text-white py-3 mb-3 rounded-lg  "
            >
              ← Continue Shopping
            </button>



          </div>
        </div>


      </div>
    </div>
  );
}

export default Cart;
