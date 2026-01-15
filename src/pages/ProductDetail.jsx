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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE6] min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ================= IMAGE SLIDER ================= */}
        <div className="space-y-4">
          <div className="relative bg-white rounded-xl shadow overflow-hidden">
            <img
              src={product.images?.[activeImage]?.url || "/no-image.png"}
              alt={product.name}
              className="w-full h-[350px] object-contain"
            />

            {/* LEFT */}
            {product.images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black"
              >
                ‹
              </button>
            )}

            {/* RIGHT */}
            {product.images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black"
              >
                ›
              </button>
            )}
          </div>

          {/* THUMBNAILS */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={img._id}
                  src={img.url}
                  alt="thumb"
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition
                    ${activeImage === index
                      ? "border-[#2F4F3E]"
                      : "border-transparent hover:border-gray-300"}
                  `}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div>
          <h1 className="text-3xl font-serif text-[#2F4F3E]">
            {product.name}
          </h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-green-700">
            ₹{product.discountedPrice || product.price}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Weight: {product.weight}
          </p>

          {/* STOCK */}
          {!product.inStock && (
            <p className="mt-2 text-red-600 font-semibold">
              Out of Stock
            </p>
          )}

          {/* ACTION BUTTON */}
          <button
            disabled={isAdding || !product.inStock}
            onClick={handleButtonClick}
            className={`
              mt-6 w-full py-3 rounded-lg text-white transition
              ${!product.inStock
                ? "bg-gray-400 cursor-not-allowed"
                : isInCart
                ? "bg-[#2F4F3E] hover:bg-[#243C30]"
                : "bg-black hover:bg-gray-900"}
              disabled:opacity-50
            `}
          >
            {isAdding
              ? "Adding..."
              : !product.inStock
              ? "Out of Stock"
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
