import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/products");
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStock = async (id) => {
    try {
      await adminApi.put(`/products/${id}/toggle-stock`);
      toast.success("Stock status updated");
      fetchProducts();
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await adminApi.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading products...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-[#2F4F3E]">
          Products Management
        </h1>

        <Link
          to="/admin/products/add"
          className="bg-[#2F4F3E] text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add Product
        </Link>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#F5EFE6] text-[#2F4F3E]">
            <tr>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-center font-semibold">Price</th>
              <th className="p-4 text-center font-semibold">Stock</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-left">
                  {p.name}
                </td>

                <td className="p-4 text-left capitalize">
                  {p.category}
                </td>

                <td className="p-4 text-center">
                  ₹{p.price}
                </td>

                <td className="p-4 text-center">
                  {p.stockQuantity}
                </td>

                <td className="p-4 text-center">
                  {/* STATUS TOGGLE / BADGE */}
                  <button
                    onClick={() => toggleStock(p._id)}
                    className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none
    ${p.inStock ? "bg-green-600" : "bg-gray-400"}
  `}
                  >
                    {/* TOGGLE BALL */}
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
      ${p.inStock ? "translate-x-8" : "translate-x-1"}
    `}
                    />
                  </button>
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/products/${p._id}/edit`}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-4 space-y-2"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{p.name}</h3>
              <span className="text-sm font-bold">₹{p.price}</span>
            </div>

            <p className="text-xs text-gray-500">
              {p.category} • Stock: {p.stockQuantity}
            </p>

            <button
              onClick={() => toggleStock(p._id)}
              className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none
    ${p.inStock ? "bg-green-600" : "bg-gray-400"}
  `}
            >
              {/* TOGGLE BALL */}
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
      ${p.inStock ? "translate-x-8" : "translate-x-1"}
    `}
              />
            </button>


            <div className="flex gap-2">
              <Link
                to={`/admin/products/${p._id}/edit`}
                className="flex-1 text-center py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteProduct(p._id)}
                className="flex-1 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;
