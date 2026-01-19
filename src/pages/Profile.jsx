import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../api/userApi";
import { useAuth } from "../context/AuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- HOOKS MOVED TO THE TOP ---
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showStates, setShowStates] = useState(false);

  const [formData, setFormData] = useState({
    label: "",
    name: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data } = await userApi.get("/users/addresses");
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  // --- CONDITIONAL RETURN AFTER HOOKS ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#2F4F3E] mb-3">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#2F4F3E] text-white px-6 py-2 rounded-lg hover:bg-[#244235] transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ---------- LABEL OPTIONS (Smart) ----------
  const usedLabels = addresses.map(a => a.label);
  const labelOptions = ["Home", "Office", "Other"].filter(
    l => editingId || !usedLabels.includes(l)
  );

  // ---------- ADD ----------
  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      label: "",
      name: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
    setShowForm(true);
  };

  // ---------- EDIT ----------
  const openEditForm = (addr) => {
    setEditingId(addr._id);
    setFormData(addr);
    setShowForm(true);
  };

  // ---------- SAVE ----------
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter valid 10-digit Indian phone number");
      return;
    }

    if (editingId) {
      await userApi.put(
        `/users/addresses/${editingId}`,
        formData
      );
      toast.success("Address updated ✅");
    } else {
      await userApi.post("/users/addresses", formData);
      toast.success("Address added ✅");
    }

    setShowForm(false);
    fetchAddresses();
  };

  // ---------- DELETE ----------
  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await userApi.delete(`/users/addresses/${id}`);
    fetchAddresses();
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* USER INFO */}
          <div>
            <h2 className="text-2xl font-bold text-[#2F4F3E]">
              {user?.name}
            </h2>
            <p className="text-gray-600 text-sm break-all pt-1.5">
              {user?.email}
            </p>
          </div>

          {/* MY ORDERS BUTTON */}
          <button
            onClick={() => navigate("/my-orders")}
            className="
      bg-[#2F4F3E] text-white
      px-5 py-2 rounded-lg
      hover:bg-[#13271c]
      w-full md:w-auto
      self-start md:self-auto 
    "
          >
            My Orders
          </button>
        </div>


        {/* ================= ADDRESSES ================= */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-[#2F4F3E] pb-2">
              Saved Addresses
            </h3>

            <button
              onClick={openAddForm}
              className="
        bg-[#2F4F3E] text-white
        px-4 py-2 rounded-lg
        hover:bg-[#13271c]
        w-full sm:w-auto
      "
            >
              Add Address
            </button>
          </div>


          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses added yet.</p>
          ) : (
            /* 🔥 RESPONSIVE GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
                >
                  {/* LEFT INFO */}
                  <div>
                    <p className="font-semibold text-[#2F4F3E]">
                      {addr.label}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                      {addr.pincode}
                    </p>
                    <p className="text-sm mt-1">📞 {addr.phone}</p>
                  </div>

                  <div className="flex flex-col gap-2 items-end self-start min-w-[110px]">
                    <button
                      onClick={() => openEditForm(addr)}
                      className="
      w-full
      flex items-center justify-center
      text-blue-700 bg-blue-100
      px-4 py-1.5 rounded-lg text-sm font-medium
      hover:bg-blue-600 hover:text-white
      transition duration-200 ease-in-out
      shadow-sm hover:shadow-md
    "
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="
      w-full
      flex items-center justify-center
      text-red-700 bg-red-100
      px-4 py-1.5 rounded-lg text-sm font-medium
      hover:bg-red-600 hover:text-white
      transition duration-200 ease-in-out
      shadow-sm hover:shadow-md
    "
                    >
                      🗑️ Delete
                    </button>
                  </div>


                </div>
              ))}
            </div>
          )}
        </div>


        {/* ================= ADDRESS FORM MODAL ================= */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Address" : "Add Address"}
              </h3>

              <form onSubmit={submitHandler} className="space-y-3">

                <select
                  required
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Label</option>
                  {labelOptions.map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>

                <input
                  required
                  placeholder="NAME"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  required
                  placeholder="ADDRESS"
                  value={formData.addressLine}
                  onChange={e => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  required
                  placeholder="CITY"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />

                {/* STATE (same logic as checkout) */}
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
                    <div className="absolute z-20 bg-white border w-full max-h-40 overflow-y-auto">
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
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  required
                  placeholder="PHONE"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2F4F3E] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;