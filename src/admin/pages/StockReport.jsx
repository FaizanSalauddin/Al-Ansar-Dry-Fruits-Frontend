import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  IndianRupee,
  Filter,
  Download,
  Search,
  RefreshCw,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const StockReport = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'stockQuantity', direction: 'asc' });

  useEffect(() => {
    fetchStockReport();
  }, []);

  const fetchStockReport = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/products/stock-report");
      setProducts(data.products || []);
      setSummary(data.summary || null);
    } catch (error) {
      console.error("Stock report error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStockReport();
  };

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

  const filteredProducts = sortedProducts.filter(product => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);

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
      case "critical-stock":
        return product.stockQuantity < 5;
      case "all":
      default:
        return true;
    }
  });

  const exportToCSV = () => {
    const headers = ["Product Name", "Category", "Price", "Stock", "Status", "Inventory Value"];
    const rows = filteredProducts.map(p => [
      p.name,
      p.category,
      `₹${p.price}`,
      p.stockQuantity,
      p.inStock ? "In Stock" : "Out of Stock",
      `₹${p.price * p.stockQuantity}`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStockStatusColor = (stockQuantity, inStock) => {
    if (!inStock) return "text-red-600";
    if (stockQuantity < 5) return "text-red-600";
    if (stockQuantity < 10) return "text-orange-600";
    if (stockQuantity < 20) return "text-yellow-600";
    return "text-emerald-600";
  };

  const getStockStatusBadge = (stockQuantity, inStock) => {
    if (!inStock) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <TrendingDown size={12} />
          Out of Stock
        </span>
      );
    }

    if (stockQuantity < 5) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertTriangle size={12} />
          Critical ({stockQuantity})
        </span>
      );
    }

    if (stockQuantity < 10) {
      return (
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertTriangle size={12} />
          Low ({stockQuantity})
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
        <TrendingUp size={12} />
        In Stock ({stockQuantity})
      </span>
    );
  };

  const getStockProgress = (stockQuantity) => {
    const maxStock = 50; // Maximum expected stock for progress calculation
    const percentage = Math.min((stockQuantity / maxStock) * 100, 100);

    if (stockQuantity < 5) return { width: `${percentage}%`, color: "bg-red-500" };
    if (stockQuantity < 10) return { width: `${percentage}%`, color: "bg-orange-500" };
    if (stockQuantity < 20) return { width: `${percentage}%`, color: "bg-yellow-500" };
    return { width: `${percentage}%`, color: "bg-emerald-500" };
  };

  if (loading && !products.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600">Loading stock report...</p>
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
            Stock Inventory Report
          </h1>
          <p className="text-gray-500 mt-1">Real-time inventory tracking and analysis</p>
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
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
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

          <button
            onClick={exportToCSV}
            //px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2
            //px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base
            className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{summary.totalProducts}</p>
              </div>
              <Package className="text-emerald-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="text-2xl font-bold text-emerald-600">{summary.inStock}</p>
              </div>
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((summary.inStock / summary.totalProducts) * 100)}% of total
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{summary.outOfStock}</p>
              </div>
              <TrendingDown className="text-red-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((summary.outOfStock / summary.totalProducts) * 100)}% of total
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold text-indigo-600 flex items-center gap-1">
                  <IndianRupee size={20} />
                  {summary.totalInventoryValue.toLocaleString('en-IN')}
                </p>
              </div>
              <BarChart3 className="text-indigo-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Average: ₹{Math.round(summary.totalInventoryValue / summary.totalProducts)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter stock status:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All Products"],
            ["in-stock", "In Stock"],
            ["out-of-stock", "Out of Stock"],
            ["low-stock", "Low Stock (< 10)"],
            ["critical-stock", "Critical (< 5)"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === key
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {key === 'critical-stock' && <AlertTriangle size={14} />}
              {key === 'low-stock' && <AlertTriangle size={14} />}
              {key === 'in-stock' && <TrendingUp size={14} />}
              {key === 'out-of-stock' && <TrendingDown size={14} />}
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
                : "No products available"}
          </p>
          <div className="mt-4 flex gap-2 justify-center">
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
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Category</th>
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
                        Stock Level
                        {sortConfig.key === 'stockQuantity' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Status</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Inventory Value</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const inventoryValue = product.price * product.stockQuantity;
                    const progress = getStockProgress(product.stockQuantity);

                    return (
                      <tr key={product._id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Package size={18} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-xs text-gray-500">
                                SKU: {product.sku || product._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold text-gray-800">
                            <IndianRupee size={14} />
                            {product.price.toLocaleString('en-IN')}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold ${getStockStatusColor(product.stockQuantity, product.inStock)}`}>
                                {product.stockQuantity} units
                              </span>
                              <span className="text-xs text-gray-500">
                                {product.stockQuantity < 10 ? "Reorder needed" : "Adequate"}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${progress.color}`}
                                style={{ width: progress.width }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {getStockStatusBadge(product.stockQuantity, product.inStock)}
                        </td>

                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 font-bold text-gray-800">
                              <IndianRupee
                                size={14} />
                              {inventoryValue.toLocaleString('en-IN')}
                            </div>
                            <p className="text-xs text-gray-500">
                              {product.stockQuantity} × ₹{product.price}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredProducts.map((product) => {
              const inventoryValue = product.price * product.stockQuantity;
              const progress = getStockProgress(product.stockQuantity);

              return (
                <div key={product._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          SKU: {product.sku || product._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    {getStockStatusBadge(product.stockQuantity, product.inStock)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <IndianRupee size={14} />
                        {product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Stock</p>
                      <p className={`text-sm font-semibold ${getStockStatusColor(product.stockQuantity, product.inStock)}`}>
                        {product.stockQuantity} units
                      </p>
                    </div>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mb-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${progress.color}`}
                        style={{ width: progress.width }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>Stock Level</span>
                      <span>50+</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Inventory Value</p>
                        <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                          <IndianRupee size={16} />
                          {inventoryValue.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Calculation</p>
                        <p className="text-sm text-gray-600">
                          {product.stockQuantity} × ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Stock Insights */}
      {summary && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <BarChart3 size={18} />
            Stock Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Stock Health</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(summary.inStock / summary.totalProducts) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-blue-800">
                  {Math.round((summary.inStock / summary.totalProducts) * 100)}%
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {summary.inStock} of {summary.totalProducts} products in stock
              </p>
            </div>

            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Critical Items</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stockQuantity < 5 && p.inStock).length}
              </p>
              <p className="text-xs text-blue-600 mt-1">Products with less than 5 units</p>
            </div>

            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Average Stock Value</p>
              <p className="text-2xl font-bold text-indigo-600 flex items-center gap-1">
                <IndianRupee size={20} />
                {Math.round(summary.totalInventoryValue / summary.totalProducts).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-blue-600 mt-1">Per product average</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReport;