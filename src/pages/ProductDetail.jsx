import { useEffect, useState } from "react";
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
  const [quantity, setQuantity] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2F4F3E] border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFE6] to-[#E8DFD1] px-4 md:px-6 py-8">
      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Added to cart successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm">
            <li>
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-[#2F4F3E] transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
            </li>
            <li className="mx-2 text-gray-400">›</li>
            <li>
              <button
                onClick={() => navigate("/products")}
                className="text-gray-500 hover:text-[#2F4F3E] transition-colors duration-200"
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
          {/* ================= ENHANCED IMAGE SECTION ================= */}
          <div className="space-y-4">
            {/* Main Image Container with Zoom Effect */}
            <div
              className="relative bg-white rounded-3xl shadow-xl overflow-hidden group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <div className={`aspect-square transition-transform duration-700 ${isZoomed ? 'scale-110' : 'scale-100'}`}>
                <img
                  src={imageError ? "/no-image.png" : (product.images?.[activeImage]?.url || "/no-image.png")}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  onError={() => setImageError(true)}
                />
              </div>

              {/* Enhanced Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Enhanced Stock Badge */}
              {!product.inStock ? (
                <div className="absolute top-4 left-4 animate-pulse">
                  <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Out of Stock
                  </span>
                </div>
              ) : (
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-green-600 to-green-500 text-white text-sm px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    In Stock
                  </span>
                </div>
              )}

              {/* Enhanced Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {activeImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Enhanced Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                {product.images.map((img, index) => (
                  <button
                    key={img._id}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105
                      ${activeImage === index
                        ? "ring-4 ring-[#2F4F3E] ring-offset-2 shadow-xl"
                        : "opacity-70 hover:opacity-100 shadow-md"}
                    `}
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

          {/* ================= ENHANCED DETAILS SECTION ================= */}
          <div className="space-y-6">
            {/* Product Title with Rating */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2F4F3E] leading-tight">
                  {product.name}
                </h1>
                {/* Wishlist Button */}
                <button className="p-2 hover:bg-white rounded-full transition-colors duration-200">
                  <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">(4.5) · 127 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mt-6">
                <div className="text-3xl lg:text-4xl font-bold text-green-700">
                  ₹{product.discountedPrice || product.price}
                </div>
                {product.discountedPrice && (
                  <>
                    <div className="text-gray-400 text-xl line-through">
                      ₹{product.price}
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Save ₹{product.price - product.discountedPrice}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-[#2F4F3E] mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Enhanced Specifications */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-[#2F4F3E] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Product Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-4 rounded-lg transition-colors duration-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Weight
                  </span>
                  <span className="font-semibold text-[#2F4F3E]">{product.weight}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-4 rounded-lg transition-colors duration-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Category
                  </span>
                  <span className="font-semibold text-[#2F4F3E]">{product.category}</span>
                </div>
                <div className="flex justify-between items-center py-3 hover:bg-gray-50 px-4 rounded-lg transition-colors duration-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Stock Status
                  </span>
                  <span className={`font-semibold flex items-center gap-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-600 animate-pulse' : 'bg-red-600'} mr-2`}></span>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.inStock && !isInCart && (
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Available: {product.stock || '10+'}</span>
                </div>
              </div>
            )}

            {/* Enhanced Action Button */}
            <button
              disabled={isAdding || !product.inStock}
              onClick={handleButtonClick}
              className={`
                w-full py-5 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105
                ${!product.inStock
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  : isInCart
                    ? "bg-gradient-to-r from-[#2F4F3E] to-[#1E3327] hover:shadow-2xl"
                    : "bg-gradient-to-r from-black to-gray-800 hover:shadow-2xl"}
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-3 shadow-xl
              `}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding to Cart...
                </>
              ) : !product.inStock ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Out of Stock
                </>
              ) : isInCart ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  View in Cart
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart · ₹{(product.discountedPrice || product.price) * quantity}
                </>
              )}
            </button>

            {/* Secure Checkout Badge */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;