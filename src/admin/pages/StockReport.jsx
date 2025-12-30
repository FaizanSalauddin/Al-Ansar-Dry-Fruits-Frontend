import { useEffect, useState } from "react";
import api from "../../api/axios";

const StockReport = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockReport = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products/stock-report");

        // ✅ CORRECT KEYS
        setProducts(data.products || []);
        setSummary(data.summary || null);

      } catch (error) {
        console.error("Stock report error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockReport();
  }, []);

  if (loading) {
    return <p className="p-4">Loading stock report...</p>;
  }

  if (!products.length) {
    return <p className="p-4">No stock data available</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Report</h1>

      {/* SUMMARY */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded p-3">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-xl font-bold">{summary.totalProducts}</p>
          </div>

          <div className="bg-white shadow rounded p-3">
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-xl font-bold">{summary.inStock}</p>
          </div>

          <div className="bg-white shadow rounded p-3">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-xl font-bold">{summary.outOfStock}</p>
          </div>

          <div className="bg-white shadow rounded p-3">
            <p className="text-sm text-gray-500">Inventory Value</p>
            <p className="text-xl font-bold">
              ₹{summary.totalInventoryValue}
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2 capitalize">{p.category}</td>
                <td className="border p-2 text-center">₹{p.price}</td>
                <td className="border p-2 text-center">
                  {p.stockQuantity}
                </td>
                <td className="border p-2 text-center">
                  {p.inStock ? (
                    <span className="text-green-600 font-semibold">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Out
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockReport;
