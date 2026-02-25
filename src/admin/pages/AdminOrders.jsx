import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Truck,
  Package,
  CreditCard,
  Wallet,
  User,
  MapPin,
  ShoppingBag,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  Phone,
  Mail,
  Home,
  Box,
  DollarSign,
  RefreshCw
} from "lucide-react";

function AdminOrders() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userFilter = queryParams.get("user");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [eta, setEta] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  /* ================= FETCH ================= */
  /* ================= FETCH ================= */
  const fetchOrders = async (activeFilter = filter) => {
    try {
      setLoading(true);
      let url = "/orders";

      // Create an array to hold query parameters
      const params = new URLSearchParams();

      // Preserve the user filter from the URL if it exists
      if (userFilter) params.append("user", userFilter);

      // Map activeFilter to backend query parameters
      switch (activeFilter) {
        case "today":
          params.append("date", "today");
          break;
        case "pending":
        case "delivered":
        case "cancelled":
        case "confirmed":
        case "in-transit": // Added this case
          params.append("status", activeFilter);
          break;
        case "paid":
          params.append("payment", "paid");
          break;
        case "unpaid":
          params.append("payment", "unpaid");
          break;
        default:
          // 'all' doesn't need extra status params
          break;
      }

      const queryString = params.toString();
      const finalUrl = queryString ? `${url}?${queryString}` : url;

      const { data } = await adminApi.get(finalUrl);
      setOrders(data.orders || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  /* ================= REFRESH FUNCTION ================= */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders(filter);
    toast.success("Orders Refreshed Successfully!");
  };

  /* ================= DATE FORMATTER ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-IN', options);
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const month = date.toLocaleDateString('en-IN', { month: 'short' });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const today = () => new Date().toISOString().slice(0, 10);
  const tomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  /* ================= UPDATE ================= */
  const updateOrderStatus = async () => {
    try {
      setLoading(true);

      await adminApi.put(`/orders/${selectedOrder._id}/status`, { status });

      if (eta && eta !== selectedOrder.estimatedDeliveryDate?.slice(0, 10)) {
        await adminApi.put(`/orders/${selectedOrder._id}/estimated-date`, {
          estimatedDeliveryDate: eta,
        });
      }

      toast.success("Order updated successfully");
      setSelectedOrder(null);
      setEta("");
      fetchOrders();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAYMENT STATUS ================= */
  const togglePaidStatus = async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.put(
        `/orders/${selectedOrder._id}/payment-status`,
        {
          isPaid: !selectedOrder.isPaid,
        }
      );

      toast.success(data.message);
      setSelectedOrder(data.order);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BADGE STYLING ================= */
  const getStatusBadge = (status, paymentMethod, isPaid) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5";

    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border border-blue-200",
      "in-transit": "bg-indigo-100 text-indigo-800 border border-indigo-200",
      "deliver-today": "bg-orange-100 text-orange-800 border border-orange-200",
      "deliver-tomorrow": "bg-purple-100 text-purple-800 border border-purple-200",
      delivered: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
    };

    const paymentBadge = paymentMethod === 'online' ? (
      <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full">
        Online
      </span>
    ) : (
      <span className="ml-2 px-2 py-0.5 bg-gray-50 text-gray-700 text-[10px] rounded-full">
        COD
      </span>
    );

    return (
      <div className="flex items-center">
        <span className={`${baseClasses} ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}>
          {status === 'in-transit' && <Truck size={12} />}
          {status === 'delivered' && <Package size={12} />}
          {status === 'pending' && <Clock size={12} />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {paymentBadge}
        {isPaid && paymentMethod === 'online' && (
          <CheckCircle size={14} className="ml-2 text-emerald-500" />
        )}
      </div>
    );
  };

  const getPaymentBadge = (isPaid, paymentMethod) => {
    if (paymentMethod === 'online') {
      return isPaid ? (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle size={12} /> Paid
        </span>
      ) : (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
          <XCircle size={12} /> Unpaid
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Wallet size={12} /> COD
        </span>
      );
    }
  };

  /* ================= SORTING ================= */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = sortedOrders.filter(order => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.user?.name.toLowerCase().includes(searchLower) ||
      order.user?.email.toLowerCase().includes(searchLower) ||
      order.shippingAddress?.phone.includes(searchTerm)
    );
  });

  /* ================= TOGGLE ROW EXPAND ================= */
  const toggleRowExpand = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  useEffect(() => {
    fetchOrders("all");
  }, []);

  /* ================= EXPANDED ROW CONTENT ================= */
  const ExpandedRowContent = ({ order }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Delivery Address */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
          <MapPin size={12} />
          Delivery Address
        </p>
        <div className="text-sm bg-gray-50 p-3 rounded-lg">
          <p className="font-medium">{order.shippingAddress.name}</p>
          <p className="text-gray-600">{order.shippingAddress.address}</p>
          <p className="text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className="text-gray-600 flex items-center gap-1 mt-1">
            <Phone size={12} />
            {order.shippingAddress.phone}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
          <Box size={12} />
          Order Items ({order.orderItems.length})
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
              <div className="flex-1 truncate">
                <span className="font-medium">{item.name}</span>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{item.price * item.quantity}</p>
                <p className="text-xs text-gray-500">₹{item.price} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
          <Truck size={12} />
          Delivery Information
        </p>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium mb-1">Current Status</p>
            {getStatusBadge(order.orderStatus, order.paymentMethod, order.isPaid)}
          </div>

          {order.estimatedDeliveryDate ? (
            <div className="text-sm">
              <p className="font-medium mb-1">Estimated Delivery</p>
              <p className="flex items-center gap-1 text-gray-700">
                <CalendarDays size={12} />
                {formatShortDate(order.estimatedDeliveryDate)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No delivery date set</p>
          )}

          {order.deliveredAt && (
            <div className="text-sm">
              <p className="font-medium mb-1 text-emerald-600">Delivered On</p>
              <p className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-500" />
                {formatShortDate(order.deliveredAt)}
              </p>
            </div>
          )}

          <div className="text-sm">
            <p className="font-medium mb-1">Payment</p>
            <div className="flex items-center gap-2">
              {getPaymentBadge(order.isPaid, order.paymentMethod)}
              <span className="text-xs text-gray-500">
                {order.paymentMethod === 'online' ? 'Online' : 'COD'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            {userFilter && (
              <button
                onClick={() => navigate("/admin/users")}
                className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
              >
                ← Back to Users
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Orders Management
              </h1>
            </div>
          </div>

          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-64"
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {refreshing ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <ShoppingBag className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.orderStatus === 'pending').length}
              </p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-bold text-indigo-600">
                {orders.filter(o => o.orderStatus === 'in-transit').length}
              </p>
            </div>
            <Truck className="text-indigo-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-emerald-600">
                {orders.filter(o => o.orderStatus === 'delivered').length}
              </p>
            </div>
            <Package className="text-emerald-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>

        {/* ================= FILTERS UI ================= */}
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All Orders"],
            ["today", "Today's Orders"],
            ["pending", "Pending"],
            ["in-transit", "In Transit"], // Ensure this matches the status string in your DB
            ["delivered", "Delivered"],
            ["cancelled", "Cancelled"],
            ["paid", "Paid"],
            ["unpaid", "Unpaid"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setFilter(key);
                fetchOrders(key); // Triggers fetch with the new filter
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === key
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg font-semibold text-gray-600">No orders found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm ? "Try a different search term" : "There are no orders in this category"}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Orders
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-gradient-to-r from-emerald-50 to-white backdrop-blur-sm">
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('_id')}>
                      <div className="flex items-center gap-1">
                        Order ID
                        {sortConfig.key === '_id' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('user.name')}>
                      <div className="flex items-center gap-1">
                        Customer
                        {sortConfig.key === 'user.name' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('createdAt')}>
                      <div className="flex items-center gap-1">
                        Ordered On
                        {sortConfig.key === 'createdAt' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Payment</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Status</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('totalPrice')}>
                      <div className="flex items-center gap-1">
                        Total
                        {sortConfig.key === 'totalPrice' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              {order._id.slice(-8)}
                            </code>
                            <button
                              onClick={() => toggleRowExpand(order._id)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                              {expandedRows[order._id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <div>
                              <span className="font-medium block">{order.user?.name}</span>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {order.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-gray-400" />
                            <div>
                              <span className="block">{formatShortDate(order.createdAt)}</span>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {getPaymentBadge(order.isPaid, order.paymentMethod)}
                            {order.paymentMethod === "online" && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <CreditCard size={12} />
                                {order.isPaid ? "Paid Online" : "Online Payment"}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          {getStatusBadge(
                            order.orderStatus,
                            order.paymentMethod,
                            order.isPaid
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold text-gray-800">
                            <IndianRupee size={14} />
                            {order.totalPrice.toLocaleString("en-IN")}
                          </div>
                          <p className="text-xs text-gray-500">
                            {order.orderItems.length} item
                            {order.orderItems.length > 1 ? "s" : ""}
                          </p>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setStatus(order.orderStatus);
                              setEta(
                                order.estimatedDeliveryDate?.slice(0, 10) || ""
                              );
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
                          >
                            <Eye size={14} />
                            Manage
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows[order._id] && (
                        <tr className="bg-gray-50">
                          <td colSpan="7" className="p-0">
                            <div className="border-t">
                              <ExpandedRowContent order={order} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {order._id.slice(-8)}
                      </code>
                      {getPaymentBadge(order.isPaid, order.paymentMethod)}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <div>
                        <span className="font-medium block">{order.user?.name}</span>
                        <p className="text-xs text-gray-500">
                          {order.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(order.orderStatus, order.paymentMethod, order.isPaid)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                    <p className="text-sm font-medium">{formatShortDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <IndianRupee size={14} />
                      {order.totalPrice.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRowExpand(order._id)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-gray-50"
                  >
                    {expandedRows[order._id] ? (
                      <>
                        <ChevronUp size={14} />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        Show Details
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setStatus(order.orderStatus);
                      setEta(order.estimatedDeliveryDate?.slice(0, 10) || "");
                    }}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm flex items-center justify-center gap-1 hover:from-emerald-600 hover:to-emerald-700"
                  >
                    <Eye size={14} />
                    Manage
                  </button>
                </div>

                {/* Expanded Mobile Content */}
                {expandedRows[order._id] && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                        <MapPin size={12} />
                        Delivery Address
                      </p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        <br />
                        <span className="flex items-center gap-1 mt-1">
                          <Phone size={12} />
                          {order.shippingAddress.phone}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                        <Box size={12} />
                        Items ({order.orderItems.length})
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {order.orderItems.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="truncate flex-1">{item.name}</span>
                            <span className="font-medium">₹{item.price} × {item.quantity}</span>
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{order.orderItems.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                        <Truck size={12} />
                        Delivery Info
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Status: </span>
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                        {order.estimatedDeliveryDate && (
                          <div className="text-sm">
                            <span className="font-medium">Est. Delivery: </span>
                            <span>{formatShortDate(order.estimatedDeliveryDate)}</span>
                          </div>
                        )}
                        {order.deliveredAt && (
                          <div className="text-sm text-emerald-600">
                            <span className="font-medium">Delivered: </span>
                            <span>{formatShortDate(order.deliveredAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <p className="text-sm text-gray-500">Order ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="text-gray-500" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User size={16} />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">
                      {selectedOrder.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                      {selectedOrder.paymentMethod === 'online' && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedOrder.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  Delivery Address
                </h3>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.name}<br />
                  {selectedOrder.shippingAddress.address}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  <br />📞 {selectedOrder.shippingAddress.phone}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ShoppingBag size={16} />
                  Order Items ({selectedOrder.orderItems.length})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-gray-500">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{selectedOrder.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{selectedOrder.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">₹{selectedOrder.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Update Section */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3">Update Order</h3>

                {/* Payment Status (only for COD) */}
                {selectedOrder.paymentMethod === 'cod' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <button
                      onClick={togglePaidStatus}
                      disabled={loading}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${selectedOrder.isPaid
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                      {selectedOrder.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                    </button>
                  </div>
                )}

                {/* Order Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      if (e.target.value === "deliver-today") setEta(today());
                      if (e.target.value === "deliver-tomorrow") setEta(tomorrow());
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-transit">In Transit</option>
                    <option value="deliver-today">Deliver Today</option>
                    <option value="deliver-tomorrow">Deliver Tomorrow</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Delivery Date */}
                {status !== "delivered" ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      value={eta}
                      onChange={(e) => setEta(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                ) : selectedOrder.deliveredAt ? (
                  <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                    <p className="text-emerald-700 font-medium flex items-center gap-2">
                      <CheckCircle size={16} />
                      Delivered on {formatDate(selectedOrder.deliveredAt)}
                    </p>
                  </div>
                ) : null}

                <button
                  onClick={updateOrderStatus}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={18} />
                      Updating...
                    </span>
                  ) : (
                    'Update Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;