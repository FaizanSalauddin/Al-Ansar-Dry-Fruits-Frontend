import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import userApi from "../api/userApi";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";

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
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    label: "Home", name: "", addressLine: "", city: "", state: "", pincode: "", phone: "",
  });

  useEffect(() => {
    fetchAddresses();
    // Local storage se purana selected address uthao agar hai toh
    const saved = localStorage.getItem("shippingAddress");
    if (saved) setSelectedAddress(JSON.parse(saved));
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await userApi.get("/users/addresses");
      setAddresses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Remove this address?")) {
      try {
        await userApi.delete(`/users/addresses/${id}`);
        toast.success("Removed");
        fetchAddresses();
        if (selectedAddress?._id === id) {
          setSelectedAddress(null);
          localStorage.removeItem("shippingAddress");
        }
      } catch (err) { toast.error("Failed"); }
    }
  };

  const startEditHandler = (addr) => {
    setEditMode(true);
    setEditId(addr._id);
    setFormData({ ...addr });
    setShowForm(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.phone)) return toast.error("Invalid Phone");

    try {
      let savedData;
      if (editMode) {
        const { data } = await userApi.put(`/users/addresses/${editId}`, formData);
        savedData = data;
      } else {
        const { data } = await userApi.post("/users/addresses", formData);
        savedData = data;
      }

      // ✅ Yeh line important hai: State aur LocalStorage dono update honge
      setSelectedAddress(savedData);
      localStorage.setItem("shippingAddress", JSON.stringify(savedData));

      toast.success("Address Saved ✅");
      setShowForm(false);
      setEditMode(false);
      fetchAddresses();
    } catch (err) { toast.error("Error saving address"); }
  };

  // Price Logic
  const subtotal = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* SECTION 1: ADDRESS */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold text-[#2F4F3E] mb-7">Shipping Address</h2>
          <CheckoutSteps currentStep="address" />
          {addresses.length > 0 && !showForm && (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr._id} className={`border rounded-lg p-3 flex justify-between items-start ${selectedAddress?._id === addr._id ? "border-[#2F4F3E] bg-green-50" : ""}`}>
                  <label className="flex gap-5 cursor-pointer flex-1 pb-3">
                    <input type="radio" checked={selectedAddress?._id === addr._id} onChange={() => {
                      setSelectedAddress(addr);
                      localStorage.setItem("shippingAddress", JSON.stringify(addr));
                    }} />
                    <div className="text-sm">
                      <p className="font-bold">{addr.name} ({addr.label})</p>
                      <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p>📞 {addr.phone}</p>
                    </div>
                  </label>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEditHandler(addr)} className="  pl-5  w-full
      flex items-center justify-center
      text-blue-700 bg-blue-100
      px-4 py-1.5 rounded-lg text-sm font-medium
      hover:bg-blue-600 hover:text-white
      transition duration-200 ease-in-out
      shadow-sm hover:shadow-md">  ✏️ EDIT</button>
                    <button onClick={() => deleteHandler(addr._id)} className="   pl-5 w-full
      flex items-center justify-center
      text-red-700 bg-red-100
      px-4 py-1.5 rounded-lg text-sm font-medium
      hover:bg-red-600 hover:text-white
      transition duration-200 ease-in-out
      shadow-sm hover:shadow-md"> 🗑️ REMOVE</button>
                  </div>
                </div>
              ))}
              <button onClick={() => { setShowForm(true); setEditMode(false); setFormData({ label: "Home", name: "", addressLine: "", city: "", state: "", pincode: "", phone: "" }) }} className="mt-5 w-full bg-[#2F4F3E] text-white py-4 rounded-xl font-bold disabled:opacity-50 hover:bg-[#243C30] transition shadow-lg ">+ Add New Address</button>
            </div>
          )}

          {(addresses.length === 0 || showForm) && (
            <form onSubmit={submitHandler} className="space-y-3 mt-4 border-t pt-4">
              <h3 className="font-bold">{editMode ? "Edit Address" : "New Address"}</h3>
              <input required placeholder="NAME" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input required placeholder="ADDRESS" value={formData.addressLine} onChange={e => setFormData({ ...formData, addressLine: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="CITY" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full border px-3 py-2 rounded" />
                <div className="relative">
                  <input required placeholder="STATE" value={formData.state} onFocus={() => setShowStates(true)} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full border px-3 py-2 rounded" />
                  {showStates && (
                    <div className="absolute z-20 bg-white border w-full max-h-32 overflow-y-auto">
                      {INDIAN_STATES.filter(s => s.toLowerCase().includes(formData.state.toLowerCase())).map(s => (
                        <div key={s} onClick={() => { setFormData({ ...formData, state: s }); setShowStates(false); }} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="PINCODE" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full border px-3 py-2 rounded" />
                <input required placeholder="PHONE" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex gap-2">
                {addresses.length > 0 && <button type="button" onClick={() => setShowForm(false)} className="flex-1 border py-2 rounded">Cancel</button>}
                <button type="submit" className="flex-[2] bg-[#2F4F3E] text-white py-2 rounded font-bold">Save This Address</button>
              </div>
            </form>
          )}


          {/* SECTION 2: ORDER SUMMARY (Merged) */}
          <div className="bg-white p-6 rounded-xl shadow mt-10 ">
            <h2 className="text-xl font-bold text-[#2F4F3E] mb-5 mt-5">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 border-b pb-3"
                >
                  {/* LEFT: IMAGE + NAME */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />

                    <div className="text-sm">
                      <p className="font-semibold text-[#2F4F3E]">
                        {item.name}
                      </p>
                      <p className="text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: PRICE */}
                  <div className="text-sm font-bold text-gray-800">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-b pb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
              <div className="flex justify-between text-lg font-bold text-[#2F4F3E] pt-2"><span>Total</span><span>₹{grandTotal}</span></div>
            </div>

            {/* Checkout Button - Only active if address is selected */}
            <button
              disabled={!selectedAddress || showForm}
              onClick={() => navigate("/place-order")}
              className="mt-6 w-full bg-[#2F4F3E] text-white py-4 rounded-xl font-bold disabled:opacity-50 hover:bg-[#243C30] transition shadow-lg"
            >
              {selectedAddress ? "Proceed To Payment →" : "Please Select Address"}
            </button>

            {!selectedAddress && !showForm && (
              <p className="text-center text-red-500 text-sm mt-2">Choose a shipping address to continue</p>
            )}
            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 border py-2 rounded-lg text-lg hover:bg-[#57816b] bg-[#2F4F3E] text-white font-bold "
            >
              ← Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;