import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Layers,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/products");
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    toast.success("Products refreshed!");
  };

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
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await adminApi.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= FILTERING & SORTING ================= */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter logic 
  const filteredProducts = sortedProducts.filter(product => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Stock filter
    switch (filter) {
      case "in-stock":
        return product.inStock === true;
      case "out-of-stock":
        return product.inStock === false;
      case "low-stock":
        return product.stockQuantity < 10;
      case "all":
      default:
        return true;
    }
  });

  /* ================= TOGGLE ROW EXPAND ================= */
  const toggleRowExpand = (productId) => {
    setExpandedRows(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  /* ================= STATS CALCULATION ================= */
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    lowStock: products.filter(p => p.stockQuantity < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-64"
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {refreshing ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                Refreshing
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Refresh
              </>
            )}
          </button>

          <Link
            to="/admin/products/add"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Package className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.inStock}</p>
            </div>
            <CheckCircle className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
            </div>
            <AlertCircle className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl font-bold text-indigo-600">
                ₹{stats.totalValue.toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign className="text-indigo-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All Products"],
            ["in-stock", "In Stock"],
            ["out-of-stock", "Out of Stock"],
            ["low-stock", "Low Stock (< 10)"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === key
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {key === "in-stock" && filter === key && (
                <CheckCircle size={14} />
              )}
              {key === "out-of-stock" && filter === key && (
                <XCircle size={14} />
              )}
              {key === "low-stock" && filter === key && (
                <AlertCircle size={14} />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg font-semibold text-gray-600">No products found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm
              ? `No products found for "${searchTerm}"`
              : filter !== "all"
                ? `No products match the "${filter.replace('-', ' ')}" filter`
                : "Add your first product to get started"}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Search
              </button>
            )}
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-20 bg-gradient-to-r from-emerald-50 to-white backdrop-blur-sm">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Product</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('category')}>
                      <div className="flex items-center gap-1">
                        Category
                        {sortConfig.key === 'category' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        Price
                        {sortConfig.key === 'price' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('stockQuantity')}>
                      <div className="flex items-center gap-1">
                        Stock
                        {sortConfig.key === 'stockQuantity' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Status</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <>
                      <tr key={product._id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover border"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">
                                {product.description || "No description"}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleRowExpand(product._id)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                              {expandedRows[product._id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <Tag size={12} />
                            {product.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold text-gray-800">
                            <DollarSign size={14} />
                            {product.price.toLocaleString('en-IN')}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${product.stockQuantity < 5
                                  ? 'text-red-600'
                                  : product.stockQuantity < 10
                                    ? 'text-orange-600'
                                    : 'text-emerald-600'
                                  }`}>
                                  {product.stockQuantity}
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${product.stockQuantity < 5
                                      ? 'bg-red-500'
                                      : product.stockQuantity < 10
                                        ? 'bg-orange-500'
                                        : 'bg-emerald-500'
                                      }`}
                                    style={{ width: `${Math.min((product.stockQuantity / 50) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              {product.stockQuantity < 10 && (
                                <p className="text-xs text-red-500 mt-1">Low stock</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => toggleStock(product._id)}
                            className={`relative inline-flex items-center h-7 w-14 rounded-full transition-all duration-300 ${product.inStock
                              ? 'bg-emerald-500 hover:bg-emerald-600'
                              : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${product.inStock ? "translate-x-8" : "translate-x-1"
                                }`}
                            />
                          </button>
                          <p className="text-xs mt-1 text-gray-500">
                            {product.inStock ? 'Active' : 'Disabled'}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">


                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>

                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows[product._id] && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="p-4 border-t">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Product ID</p>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                  {product._id}
                                </code>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Created</p>
                                <p className="text-sm">
                                  {new Date(product.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Last Updated</p>
                                <p className="text-sm">
                                  {new Date(product.updatedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>

                              <div className="col-span-2 md:col-span-4">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Full Description</p>
                                <p className="text-sm text-gray-700">
                                  {product.description || 'No description available'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800 flex items-center gap-1">
                          <DollarSign size={14} />
                          {product.price.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${product.stockQuantity < 5
                          ? 'bg-red-100 text-red-700'
                          : product.stockQuantity < 10
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-emerald-100 text-emerald-700'
                          }`}>
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRowExpand(product._id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedRows[product._id] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <button
                      onClick={() => toggleStock(product._id)}
                      className={`relative inline-flex items-center h-7 w-14 rounded-full transition-all duration-300 ${product.inStock
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${product.inStock ? "translate-x-8" : "translate-x-1"
                          }`}
                      />
                    </button>
                    <span className="text-sm text-gray-500">
                      {product.inStock ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">

                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-blue-200"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-red-200"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                {/* Expanded Mobile Content */}
                {expandedRows[product._id] && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700">
                        {product.description || 'No description available'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Product ID</p>
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                          {product._id.slice(-8)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Created</p>
                        <p className="text-xs">
                          {new Date(product.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Updated</p>
                        <p className="text-xs">
                          {new Date(product.updatedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminProducts;