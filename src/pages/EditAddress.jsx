import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import INDIA from "../data/indiaStatesCities";

function EditAddress() {
    const navigate = useNavigate();

    const saved = JSON.parse(localStorage.getItem("shippingAddress")) || {};

    const [form, setForm] = useState({
        name: saved.name || "",
        address: saved.address || "",
        state: saved.state || "",
        city: saved.city || "",
        pincode: saved.pincode || "",
        phone: saved.phone || "",
    });

    const [showStates, setShowStates] = useState(false);
    const [showCities, setShowCities] = useState(false);

    const states = Object.keys(INDIA);
    const cities = form.state ? INDIA[form.state] : [];

    const saveHandler = (e) => {
        e.preventDefault();

        if (!states.includes(form.state)) {
            return toast.error("Please select a valid state");
        }

        if (!cities.includes(form.city)) {
            return toast.error("Please select a valid city");
        }

        localStorage.setItem("shippingAddress", JSON.stringify(form));
        toast.success("Address saved successfully");
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-[#F5EFE6] px-4 py-8">
            <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow">
                <h2 className="text-2xl font-bold text-[#2F4F3E] mb-4">
                    Edit Shipping Address
                </h2>

                <form onSubmit={saveHandler} className="space-y-4">
                    <input
                        required
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form,
                             name: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        required
                        placeholder="Full Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />

                    {/* STATE */}
                    <div className="relative">
                        <input
                            required
                            placeholder="State"
                            value={form.state}
                            onChange={(e) => {
                                setForm({ ...form, state: e.target.value, city: "" });
                                setShowStates(true);
                            }}
                            onFocus={() => setShowStates(true)}
                            className="w-full border px-3 py-2 rounded"
                        />

                        {showStates && (
                            <div className="absolute z-20 bg-white border w-full max-h-48 overflow-y-auto rounded shadow">
                                {states
                                    .filter((s) =>
                                        s.toLowerCase().includes(form.state.toLowerCase())
                                    )
                                    .map((state) => (
                                        <div
                                            key={state}
                                            onClick={() => {
                                                setForm({ ...form, state, city: "" });
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

                    {/* CITY */}
                    <div className="relative">
                        <input
                            required
                            disabled={!form.state}
                            placeholder="City"
                            value={form.city}
                            onChange={(e) => {
                                setForm({ ...form, city: e.target.value });
                                setShowCities(true);
                            }}
                            onFocus={() => setShowCities(true)}
                            className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
                        />

                        {showCities && form.state && (
                            <div className="absolute z-20 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
                                {cities
                                    .filter((c) =>
                                        c.toLowerCase().includes(form.city.toLowerCase())
                                    )
                                    .map((city) => (
                                        <div
                                            key={city}
                                            onClick={() => {
                                                setForm({ ...form, city });
                                                setShowCities(false);
                                            }}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {city}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <input
                        required
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        required
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <button className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg">
                        Save Address
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditAddress;
