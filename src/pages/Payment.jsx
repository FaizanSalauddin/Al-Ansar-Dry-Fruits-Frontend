import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cart } = useCart();

    const handlePay = async () => {
        try {
            const { data } = await userApi.post("/payments/create-intent", {
                amount: cart.totalPrice,
            });

            const result = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (result.error) {
                toast.error(result.error.message);
            } else {
                toast.success("Payment successful 🎉");
                navigate("/order-success");
            }
        } catch {
            toast.error("Payment failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Pay ₹{cart.totalPrice}</h2>

                <CardElement className="border p-3 rounded" />

                <button
                    onClick={handlePay}
                    className="mt-4 w-full bg-[#2F4F3E] text-white py-3 rounded-lg"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}

export default Payment;
