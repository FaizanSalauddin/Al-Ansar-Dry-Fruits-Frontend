import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();   // ✅ REQUIRED

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

    return (
        <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-[#2F4F3E] mb-6">
                    Your Cart
                </h1>

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
                                        onClick={() => increaseQty(item._id)}
                                        className="px-3 py-1 border rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-600 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* SUMMARY */}
                <div className="bg-white rounded-xl shadow p-5 mt-8">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{cart.totalPrice}</span>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="mt-4 w-full bg-[#2F4F3E] text-white py-3 rounded-lg"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
