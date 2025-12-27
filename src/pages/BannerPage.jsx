import { useNavigate } from "react-router-dom";

function BannerPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#F5EFE6] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-serif text-[#2F4F3E] mb-4">
        Al-Ansar Stores
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Finest Quality Dry Fruits
      </p>
      <button
        onClick={() => navigate("/home")}
        className="bg-[#2F4F3E] text-white px-6 py-3 rounded-md hover:bg-[#243C30] transition"
      >
        Shop Now
      </button>
    </div>
  );
}

export default BannerPage;
