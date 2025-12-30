import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const deleteOutOfStock = async () => {
    const out = products.filter(p => p.stockQuantity === 0);
    if (out.length === 0) {
      toast.info("No out of stock products");
      return;
    }

    for (let p of out) {
      await api.delete(`/products/${p._id}`);
    }

    toast.success("Out of stock products removed");
    fetchProducts();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Products</h1>

        <div className="flex gap-3">
          <Link
            to="/admin/products/add"
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            + Add Product
          </Link>

          <button
            onClick={deleteOutOfStock}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Out of Stock
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.category}</td>
                <td className="border p-2">₹{p.price}</td>
                <td className="border p-2">{p.stockQuantity}</td>

                <td className="border p-2 flex gap-2">
                  <Link
                    to={`/admin/products/${p._id}/edit`}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
