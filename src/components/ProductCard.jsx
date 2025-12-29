import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loadingProductId, cart } = useCart();

  const isLoading = loadingProductId === product._id;

  const isInCart = cart?.items?.some(
    (item) => item.product?._id === product._id
  );

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (isInCart) {
      navigate("/cart");
    } else {
      addToCart(product._id, 1);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* IMAGE */}
      <img
        src={product.images?.[0]?.url || "/no-image.png"}
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>

        <p className="text-green-600 font-bold mt-1">
          ₹{product.discountedPrice || product.price}
        </p>

        {/* SINGLE SMART BUTTON */}
        <button
          disabled={isLoading}
          onClick={handleButtonClick}
          className={`
            mt-4 w-full py-2 rounded-lg text-white transition
            ${isInCart 
              ? "bg-[#2F4F3E] hover:bg-[#243C30]" 
              : "bg-black hover:bg-gray-900"}
            disabled:opacity-50
          `}
        >
          {isLoading
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
