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
    <div className="bg-[#F5EFE6] min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold text-[#2F4F3E] mb-6 capitalize">
        {search
          ? `Search results for "${search}"`
          : category
          ? category
          : "All Products"}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
