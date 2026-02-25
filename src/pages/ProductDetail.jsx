import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import { useLoader } from "../context/LoaderContext";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { addToCart, loadingProductId, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ✅ quantity fixed to 1
  const quantity = 1;

  // ✅ swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isAdding = loadingProductId === id;

  const isInCart = cart?.items?.some(
    (item) => item.product?._id === id
  );

  const handleButtonClick = async () => {
    if (isInCart) {
      navigate("/cart");
    } else {
      await addToCart(id, quantity);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  // ✅ image navigation
  const nextImage = () => {
    setActiveImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // ✅ swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) nextImage();
    else if (distance < -50) prevImage();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await userApi.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Product fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, setLoading]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EFE6] to-[#E8DFD1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2F4F3E] border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFE6] to-[#E8DFD1] px-4 md:px-6 py-8">
      {/* ✅ Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="font-medium">
              Added to cart successfully!
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm">
            <li>
              <button
                onClick={() => navigate("/home")}
                className="text-gray-500 hover:text-[#2F4F3E]"
              >
                Home
              </button>
            </li>
            <li className="mx-2 text-gray-400">›</li>
            <li>
              <button
                onClick={() => navigate("/products")}
                className="text-gray-500 hover:text-[#2F4F3E]"
              >
                Products
              </button>
            </li>
            <li className="mx-2 text-gray-400">›</li>
            <li className="text-[#2F4F3E] font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ================= IMAGE SECTION ================= */}
          <div className="space-y-4">
            {/* ✅ Main Image with swipe */}
            <div
              className="relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full h-[350px] md:h-[450px] lg:h-[500px]">
                <img
                  src={
                    imageError
                      ? "/no-image.png"
                      : product.images?.[activeImage]?.url ||
                      "/no-image.png"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                  onError={() => setImageError(true)}
                />
              </div>

              {/* arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 rounded-full shadow"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 rounded-full shadow"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img._id}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ${activeImage === index
                      ? "ring-4 ring-[#2F4F3E]"
                      : "opacity-70"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS ================= */}
          <div className="space-y-6">

            {/* ===== Title + Stock Badge ===== */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg relative">

              {/* ✅ Stock badge top-right */}
              <span
                className={`absolute top-6 right-6 px-4 py-1 rounded-full text-sm font-semibold
        ${product.inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>

              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2F4F3E] pr-24">
                {product.name}
              </h1>

              {/* price */}
              <div className="flex items-center gap-4 mt-6">
                <div className="text-3xl font-bold text-green-700">
                  ₹{product.discountedPrice || product.price}
                </div>

                {product.discountedPrice && (
                  <div className="text-gray-400 text-xl line-through">
                    ₹{product.price}
                  </div>
                )}
              </div>
            </div>

            {/* ===== Description ===== */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-[#2F4F3E] mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* ===== Product Details (Improved) ===== */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-[#2F4F3E] mb-6">
                Product Details
              </h3>

              <div className="space-y-4">

                {/* Weight row */}
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-500 font-medium">Weight</span>

                  {/* ✅ highlighted weight */}
                  <span className="font-semibold text-[#2F4F3E] bg-[#F5EFE6] px-3 py-1 rounded-lg">
                    {product.weight || "—"}
                  </span>
                </div>

                {/* Category row (optional but pro) */}
                {product.category && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="font-semibold text-[#2F4F3E]">
                      {product.category}
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* ===== Button ===== */}
            <button
              disabled={isAdding || !product.inStock}
              onClick={handleButtonClick}
              className="w-full py-5 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-black to-gray-800 disabled:opacity-70 hover:scale-[1.02] transition"
            >
              {isAdding
                ? "Adding to Cart..."
                : isInCart
                  ? "View in Cart"
                  : !product.inStock
                    ? "Out of Stock"
                    : `Add to Cart · ₹${(product.discountedPrice || product.price) * quantity}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;