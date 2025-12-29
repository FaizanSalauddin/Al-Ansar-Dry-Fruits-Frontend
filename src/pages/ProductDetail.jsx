import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useLoader } from "../context/LoaderContext";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { addToCart, loadingProductId, cart } = useCart();

  const [product, setProduct] = useState(null);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE6] min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div>
          <img
            src={product.images?.[0]?.url || "/no-image.png"}
            alt={product.name}
            className="w-full h-80 object-cover rounded-xl shadow"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-serif text-[#2F4F3E]">
            {product.name}
          </h1>

          <p className="mt-4 text-gray-700">
            {product.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-green-700">
            ₹{product.discountedPrice || product.price}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Weight: {product.weight}
          </p>

          {/* SMART ACTION BUTTON */}
          <button
            disabled={isAdding}
            onClick={handleButtonClick}
            className={`
              mt-6 w-full py-3 rounded-lg text-white transition
              ${isInCart 
                ? "bg-[#2F4F3E] hover:bg-[#243C30]" 
                : "bg-black hover:bg-gray-900"}
              disabled:opacity-50
            `}
          >
            {isAdding
              ? "Adding..."
              : isInCart
              ? "Go to Cart"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
