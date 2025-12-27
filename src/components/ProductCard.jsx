import { useNavigate } from "react-router-dom";


function ProductCard({ product }) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/products/${product.id}`)}
            className="cursor-pointer bg-white rounded-xl shadow-sm ..."
        >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                {/* Image */}

                <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain"
                    />
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-[#2F4F3E] font-semibold text-lg">
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                        {product.weight}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-[#8C6A3D] font-bold">
                            ₹{product.price}
                        </span>

                        <button className="bg-[#2F4F3E] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#243C30]">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
