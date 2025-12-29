import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha",
  "Punjab","Rajasthan","Tamil Nadu","Telangana",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [showStates, setShowStates] = useState(false);

  const savedShipping = JSON.parse(
    localStorage.getItem("shippingAddress")
  );

  const [shipping, setShipping] = useState(
    savedShipping || {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    }
  );

  const submitHandler = (e) => {
    e.preventDefault();

    // ✅ Save address
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(shipping)
    );

    toast.success("Address saved ✅");

    // ✅ Go to Order Summary (NOT placing order here)
    navigate("/order-summary");
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-4">
          Checkout
        </h2>

        <form onSubmit={submitHandler} className="space-y-3">

          <input
            required
            placeholder="NAME"
            value={shipping.name}
            onChange={(e) =>
              setShipping({ ...shipping, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            required
            placeholder="ADDRESS"
            value={shipping.address}
            onChange={(e) =>
              setShipping({ ...shipping, address: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            required
            placeholder="CITY"
            value={shipping.city}
            onChange={(e) =>
              setShipping({ ...shipping, city: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          {/* STATE */}
          <div className="relative">
            <input
              required
              placeholder="STATE"
              value={shipping.state}
              onChange={(e) => {
                setShipping({ ...shipping, state: e.target.value });
                setShowStates(true);
              }}
              onFocus={() => setShowStates(true)}
              className="w-full border px-3 py-2 rounded"
            />

            {showStates && (
              <div className="absolute z-20 bg-white border rounded w-full max-h-40 overflow-y-auto shadow">
                {INDIAN_STATES.filter((state) =>
                  state.toLowerCase().includes(
                    shipping.state.toLowerCase()
                  )
                ).map((state) => (
                  <div
                    key={state}
                    onClick={() => {
                      setShipping({ ...shipping, state });
                      setShowStates(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {state}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            required
            placeholder="PINCODE"
            value={shipping.pincode}
            onChange={(e) =>
              setShipping({ ...shipping, pincode: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            required
            placeholder="PHONE"
            value={shipping.phone}
            onChange={(e) =>
              setShipping({ ...shipping, phone: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg mt-4"
          >
            Continue to Order Summary →
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
