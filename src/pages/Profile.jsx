import { Link } from "react-router-dom";

const logoutHandler = () => {
  logout();
  setCart(null);
  localStorage.removeItem("adminInfo");
  navigate("/login");
};

function Profile() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const address = JSON.parse(localStorage.getItem("shippingAddress")) || null;

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
        <div className="bg-white rounded-2xl shadow p-6">
          <a
            href="/my-orders"
            className="block text-center bg-[#2F4F3E] text-white py-3 rounded-lg hover:bg-[#244235]"
          >
            My Orders
          </a>
        </div>
        {/* GRID */}
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
                <span className="font-medium">Customer</span>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#2F4F3E]">
                Saved Shipping Address
              </h3>

              <Link
                to="/profile/edit-address"
                className="inline-block mt-4 bg-[#2F4F3E] text-white px-4 py-2 rounded-lg"
              >

                {address ? "Edit Address" : "Add Address"}
              </Link>
            </div>

            {address ? (
              <div className="text-sm text-gray-700 space-y-2">
                <p><b>Name:</b> {address.name}</p>
                <p><b>Address:</b> {address.address}</p>
                <p><b>City:</b> {address.city}</p>
                <p><b>State:</b> {address.state}</p>
                <p><b>Pincode:</b> {address.pincode}</p>
                <p><b>Phone:</b> {address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No address saved yet.
              </p>
            )}
          </div>
        </div>

        {/* QUICK ACTION */}


        <button
          onClick={logoutHandler}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>


      </div>
    </div>
  );
}

export default Profile;
