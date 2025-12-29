import { useState } from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [address, setAddress] = useState(
    JSON.parse(localStorage.getItem("shippingAddress")) || {}
  );

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-4">
          My Profile
        </h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">Saved Address</h3>
        {address?.address ? (
          <p className="text-sm text-gray-700">
            {address.address}, {address.city}, {address.state}
          </p>
        ) : (
          <p className="text-sm text-gray-500">No address saved</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
