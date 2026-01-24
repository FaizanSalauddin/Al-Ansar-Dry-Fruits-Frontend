import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import userApi from "../api/userApi";
import { useLoader } from "../context/LoaderContext";

const Products = () => {
  const { setLoading } = useLoader();
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const url = search
          ? `/products/search?q=${search}`
          : category
          ? `/products?category=${category}`
          : "/products";

        const { data } = await userApi.get(url);

        setProducts(data.products || data);
      } catch (error) {
        console.error("Fetch products error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setLoading, category, search]);

  return (
    <div className="bg-[#F5EFE6] min-h-screen px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2F4F3E] capitalize">
            {search
              ? `Search results for "${search}"`
              : category
              ? `${category} Products`
              : "All Products"}
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">No products found</p>
            <p className="text-gray-500">Try different search terms or browse categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;