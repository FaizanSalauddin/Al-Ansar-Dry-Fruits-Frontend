import { useEffect, useState } from "react";
import { useLoader } from "../context/LoaderContext";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import api from "../api/axios";

function Home() {
  const { setLoading } = useLoader();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Fetch products error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setLoading]);

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/products/categories");
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Category fetch error:", err.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-[#F5EFE6] min-h-screen">
      {/* Hero */}
      <section className="px-4 py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2F4F3E]">
          Premium Dry Fruits
        </h1>
        <p className="mt-3 text-gray-700 max-w-xl mx-auto">
          Handpicked dry fruits with guaranteed freshness and quality.
        </p>
      </section>

      {/* Categories */}
      <section className="px-4 pb-12">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat}                 // ✅ FIXED
              category={{
                name: cat,
                image: "/category-placeholder.png",
              }}
            />
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-4 pb-12">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-6">
          Best Sellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
