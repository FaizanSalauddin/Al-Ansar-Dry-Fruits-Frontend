import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Products() {
  const { setLoading } = useLoader();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [setLoading, category]);

  // Filter products by category (dummy logic)
  const filteredProducts = useMemo(() => {
    if (!category) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(category.toLowerCase())
    );
  }, [category]);

  return (
    <div className="bg-[#F5EFE6] min-h-screen px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2F4F3E]">
          {category ? `Category: ${category}` : "All Products"}
        </h1>
        <p className="text-gray-700 mt-1">
          Premium quality dry fruits for everyday needs.
        </p>
      </div>

      {/* Grid */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-600">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Products;
