import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loadingProductId, cart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isLoading = loadingProductId === product._id;

  const isInCart = cart?.items?.some(
    (item) => item.product?._id === product._id
  );

  const isOutOfStock =
    !product.inStock || product.stockQuantity === 0;

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (isOutOfStock) return;

    if (isInCart) {
      navigate("/cart");
    } else {
      addToCart(product._id, 1);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-[#2F4F3E]/20"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-50">
          <img
            src={imageError ? "/no-image.png" : (product.images?.[activeImage]?.url || "/no-image.png")}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>

        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            >
              ›
            </button>
          </>
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeImage === index ? "bg-[#2F4F3E] scale-125" : "bg-white/70"
                  }`}
              />
            ))}
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="p-4">

        <h3 className="font-semibold text-gray-800 line-clamp-1 text-sm md:text-base group-hover:text-[#2F4F3E] transition-colors">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-green-700 font-bold text-lg md:text-xl">
              ₹{product.discountedPrice || product.price}
            </p>
            {product.discountedPrice && (
              <p className="text-gray-500 text-sm line-through">
                ₹{product.price}
              </p>
            )}
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.weight}
          </span>
        </div>

        {/* Action Button */}
        <button
          disabled={isLoading || isOutOfStock}
          onClick={handleButtonClick}
          className={`
            mt-4 w-full py-3 rounded-xl text-white font-medium transition-all duration-300
            ${isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isInCart
                ? "bg-[#2F4F3E] hover:bg-[#243C30] shadow-md hover:shadow-lg"
                : "bg-black hover:bg-gray-900 shadow-md hover:shadow-lg"
            }
            disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : isInCart ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              View in Cart
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;