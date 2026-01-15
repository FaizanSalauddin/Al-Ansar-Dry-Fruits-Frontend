import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loadingProductId, cart } = useCart();

  const [activeImage, setActiveImage] = useState(0);

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
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      {/* ================= IMAGE SLIDER ================= */}
      <div className="relative">
        <img
          src={product.images?.[activeImage]?.url || "/no-image.png"}
          alt={product.name}
          className="w-full h-44 object-cover"
        />

        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full"
            >
              ›
            </button>
          </>
        )}

        {/* OUT OF STOCK BADGE */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">
          {product.name}
        </h3>

        <p className="text-green-700 font-bold mt-1">
          ₹{product.discountedPrice || product.price}
        </p>

        <button
          disabled={isLoading || isOutOfStock}
          onClick={handleButtonClick}
          className={`
            mt-4 w-full py-2 rounded-lg text-white transition
            ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : isInCart
                ? "bg-[#2F4F3E] hover:bg-[#243C30]"
                : "bg-black hover:bg-gray-900"
            }
            disabled:opacity-50
          `}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isLoading
            ? "Adding..."
            : isInCart
            ? "Go to Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
