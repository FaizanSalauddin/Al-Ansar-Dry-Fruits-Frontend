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

  const isAdding = loadingProductId === id;

  const isInCart = cart?.items?.some(
    (item) => item.product?._id === id
  );

  const handleButtonClick = () => {
    if (isInCart) {
      navigate("/cart");
    } else {
      addToCart(id, 1);
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
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4F3E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE6] min-h-screen px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 md:mb-8">
          <ol className="flex items-center text-sm text-gray-600">
            <li className="hover:text-[#2F4F3E] cursor-pointer" onClick={() => navigate("/products")}>
              Products
            </li>
            <li className="mx-2">›</li>
            <li className="text-[#2F4F3E] font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ================= IMAGE SECTION ================= */}
          <div className="space-y-4">
            {/* Main Image Container */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square">
                <img
                  src={imageError ? "/no-image.png" : (product.images?.[activeImage]?.url || "/no-image.png")}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  onError={() => setImageError(true)}
                />
              </div>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Stock Badge */}
              {!product.inStock && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {activeImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img._id}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300
                      ${activeImage === index
                        ? "border-[#2F4F3E] ring-2 ring-[#2F4F3E]/30"
                        : "border-transparent hover:border-gray-300"}
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

          {/* ================= DETAILS SECTION ================= */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#2F4F3E]">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="text-2xl lg:text-3xl font-bold text-green-700">
                  ₹{product.discountedPrice || product.price}
                </div>
                {product.discountedPrice && (
                  <div className="text-gray-500 text-lg line-through">
                    ₹{product.price}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2F4F3E] mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2F4F3E] mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Stock Status</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={isAdding || !product.inStock}
              onClick={handleButtonClick}
              className={`
                w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300
                ${!product.inStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : isInCart
                    ? "bg-[#2F4F3E] hover:bg-[#243C30] shadow-lg hover:shadow-xl"
                    : "bg-black hover:bg-gray-900 shadow-lg hover:shadow-xl"}
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-3
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
                "Out of Stock"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;