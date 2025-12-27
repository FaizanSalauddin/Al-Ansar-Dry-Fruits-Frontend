import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLoader } from "../context/LoaderContext";
import products from "../data/products";

function ProductDetail() {
    const { id } = useParams();
    const { setLoading } = useLoader();

    const product = products.find(p => p.id === Number(id));

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, [setLoading]);

    if (!product) {
        return (
            <div className="p-6 text-center text-red-600">
                Product not found
            </div>
        );
    }

    return (
        <div className="bg-[#F5EFE6] min-h-screen px-4 py-6">
            <div className="
        max-w-5xl mx-auto 
        grid grid-cols-1 
        md:grid-cols-2 
        gap-8
      ">
                {/* Image */}
                <div className="bg-white rounded-xl p-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-contain"
                    />
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-serif text-[#2F4F3E]">
                        {product.name}
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Weight: {product.weight}
                    </p>

                    <p className="mt-4 text-2xl font-bold text-[#8C6A3D]">
                        ₹{product.price}
                    </p>

                    <p className="mt-4 text-gray-700 leading-relaxed">
                        Premium quality dry fruits sourced carefully to ensure
                        freshness, taste and nutrition.
                    </p>

                    <button className="
            mt-6
            bg-[#2F4F3E]
            text-white
            px-6
            py-3
            rounded-md
            hover:bg-[#243C30]
            transition
          ">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
