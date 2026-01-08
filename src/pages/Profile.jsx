import { useState } from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [address] = useState(
    JSON.parse(localStorage.getItem("shippingAddress")) || {}
  );

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2F4F3E] text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#2F4F3E]">
              {user?.name}
            </h2>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PERSONAL INFO */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-[#2F4F3E] mb-4">
              Personal Information
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium">{user?.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium">
                  {user?.role === "admin" ? "Admin" : "Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-[#2F4F3E] mb-4">
              Saved Shipping Address
            </h3>

            {address?.address ? (
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {address.address}
                </p>
                <p>
                  <span className="font-medium">City:</span> {address.city}
                </p>
                <p>
                  <span className="font-medium">State:</span> {address.state}
                </p>
                <p>
                  <span className="font-medium">Pincode:</span>{" "}
                  {address.pincode}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {address.phone}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No address saved yet. It will be auto-saved after checkout.
              </p>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-[#2F4F3E] mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/my-orders"
              className="w-full text-center bg-[#2F4F3E] text-white py-3 rounded-lg hover:bg-[#244235] transition"
            >
              View My Orders
            </a>

            <button
              onClick={() => {
                localStorage.removeItem("shippingAddress");
                window.location.reload();
              }}
              className="w-full border border-[#2F4F3E] text-[#2F4F3E] py-3 rounded-lg hover:bg-[#2F4F3E] hover:text-white transition"
            >
              Clear Saved Address
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
