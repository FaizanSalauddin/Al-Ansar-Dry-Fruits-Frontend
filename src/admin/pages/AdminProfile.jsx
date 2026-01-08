function AdminProfile() {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (!adminInfo) return null;

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-[#2F4F3E] mb-6">
          Admin Profile
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-24 h-24 rounded-full bg-[#2F4F3E] text-white flex items-center justify-center text-3xl font-bold">
              {adminInfo.admin.name.charAt(0)}
            </div>

            <span className="mt-4 inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
              ADMIN
            </span>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 space-y-4">
            <Info label="Name" value={adminInfo.admin.name} />
            <Info label="Email" value={adminInfo.admin.email} />
            <Info label="Role" value={adminInfo.admin.role.toUpperCase()} />

            <div className="pt-4">
              <button
                onClick={() => {
                  localStorage.removeItem("adminInfo");
                  window.location.href = "/admin/login";
                }}
                className="bg-[#2F4F3E] text-white px-6 py-2 rounded-lg hover:bg-[#243C30]"
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-[#2F4F3E] break-words">
      {value}
    </p>
  </div>
);

export default AdminProfile;
