import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import userApi from "../api/userApi";
import { toast } from "react-toastify";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStates, setShowStates] = useState(false);

  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await userApi.get("/users/addresses");
      setAddresses(data);

      // ✅ SINGLE ADDRESS → AUTO CONTINUE
      if (data.length === 1) {
        localStorage.setItem(
          "shippingAddress",
          JSON.stringify(data[0])
        );
        navigate("/order-summary");
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ---------- ADD ADDRESS ----------
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter valid 10-digit Indian phone number");
      return;
    }

    try {
      const { data } = await userApi.post("/users/addresses", formData);
      toast.success("Address added ✅");

      // ✅ SAVE & CONTINUE
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(data)
      );
      navigate("/order-summary");
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-4">
          Checkout
        </h2>

        {/* ========== ADDRESS SELECTION (2+ ADDRESSES) ========== */}
        {addresses.length > 1 && !showForm && (
          <>
            <h3 className="font-semibold mb-3">
              Select Delivery Address
            </h3>

            <div className="space-y-3">
              {addresses.map(addr => (
                <label
                  key={addr._id}
                  className={`border rounded-lg p-3 flex gap-3 cursor-pointer ${selectedAddress?._id === addr._id
                    ? "border-[#2F4F3E] bg-[#F5EFE6]"
                    : ""
                    }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => setSelectedAddress(addr)}
                  />
                  <div>
                    <p className="font-medium">{addr.label}</p>
                    <p className="text-sm text-gray-600">
                      {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-sm">📞 {addr.phone}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowForm(true)}
                className="border px-4 py-2 rounded-lg"
              >
                + Add New
              </button>

              <button
                disabled={!selectedAddress}
                onClick={() => {
                  localStorage.setItem(
                    "shippingAddress",
                    JSON.stringify(selectedAddress)
                  );
                  navigate("/order-summary");
                }}
                className="bg-[#2F4F3E] text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ========== ADDRESS FORM (0 ADDRESS OR ADD NEW) ========== */}
        {(addresses.length === 0 || showForm) && (
          <form onSubmit={submitHandler} className="space-y-3 mt-4">

            <input
              required
              placeholder="NAME"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <input
              required
              placeholder="ADDRESS"
              value={formData.addressLine}
              onChange={e =>
                setFormData({ ...formData, addressLine: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <input
              required
              placeholder="CITY"
              value={formData.city}
              onChange={e =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            {/* STATE */}
            <div className="relative">
              <input
                required
                placeholder="STATE"
                value={formData.state}
                onChange={e => {
                  setFormData({ ...formData, state: e.target.value });
                  setShowStates(true);
                }}
                onFocus={() => setShowStates(true)}
                className="w-full border px-3 py-2 rounded"
              />

              {showStates && (
                <div className="absolute z-20 bg-white border w-full max-h-40 overflow-y-auto shadow">
                  {INDIAN_STATES.filter(s =>
                    s.toLowerCase().includes(formData.state.toLowerCase())
                  ).map(s => (
                    <div
                      key={s}
                      onClick={() => {
                        setFormData({ ...formData, state: s });
                        setShowStates(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              required
              placeholder="PINCODE"
              value={formData.pincode}
              onChange={e =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <input
              required
              placeholder="PHONE"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg"
            >
              Save & Continue →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;
