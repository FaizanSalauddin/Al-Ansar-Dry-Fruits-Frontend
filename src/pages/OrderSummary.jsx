import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function OrderSummary() {
    const navigate = useNavigate();
    const { cart } = useCart();

    const shipping = JSON.parse(localStorage.getItem("shippingAddress"));

    if (!cart || cart.items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-[#2F4F3E] mb-6">
                    Order Summary
                </h2>

                {/* SHIPPING INFO */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-700">
                        {shipping.name}, {shipping.address}, {shipping.city},{" "}
                        {shipping.state} - {shipping.pincode}
                        <br />
                        Phone: {shipping.phone}
                    </p>
                </div>

                {/* ITEMS */}
                <div className="space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between border-b pb-2"
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between font-bold text-lg mt-6">
                    <span>Total</span>
                    <span>₹{cart.totalPrice}</span>
                </div>

                {/* ACTION */}
                <button
                    onClick={() => navigate("/place-order")}
                    className="mt-6 w-full bg-[#2F4F3E] text-white py-3 rounded-lg"
                >
                    Confirm & Place Order
                </button>
            </div>
        </div>
    );
}

export default OrderSummary;
