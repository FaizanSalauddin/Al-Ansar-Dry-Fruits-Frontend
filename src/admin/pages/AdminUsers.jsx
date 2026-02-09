import { useEffect, useState,Fragment} from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";
import { Link} from "react-router-dom";
import {
  Users,
  User,
  Mail,
  Shield,
  Trash2,
  Search,
  Filter,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Package,
  Truck,
  Clock
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/users");
      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 const fetchUserOrders = async (userId) => {
  try {
    const { data } = await adminApi.get(`/users/${userId}/orders`);
    setUserOrders(prev => ({
      ...prev,
      [userId]: Array.isArray(data) ? data : data.orders || []
    }));
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
  }
};


  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await adminApi.delete(`/users/${id}`);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-500" />
          User deleted successfully
        </div>
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    toast.success("Users list refreshed!");
  };

  /* ================= SORTING ================= */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  /* ================= FILTERING ================= */
  const filteredUsers = sortedUsers.filter(user => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Role filter
    if (filter !== "all") {
      return user.role === filter;
    }

    return true;
  });

  /* ================= TOGGLE ROW EXPAND ================= */
  const toggleRowExpand = async (userId) => {
    const isExpanding = !expandedRows[userId];
    setExpandedRows(prev => ({
      ...prev,
      [userId]: isExpanding
    }));

    // Fetch user orders when expanding
    if (isExpanding && !userOrders[userId]) {
      await fetchUserOrders(userId);
    }
  };

  /* ================= STATS ================= */
  // Calculate total orders by summing orders from all users
  const calculateTotalOrders = () => {
    let total = 0;
    Object.values(userOrders).forEach(orders => {
      total += orders.length;
    });
    return total;
  };

  const stats = {
    total: users.length,
    customers: users.filter(u => u.role === 'user').length,
    admins: users.filter(u => u.role === 'admin').length,
    totalOrders: calculateTotalOrders(),
  };

  /* ================= ORDER STATS ================= */
  const getUserOrderStats = (userId) => {
    const orders = userOrders[userId] || [];

    const totalSpent = orders.reduce((sum, order) => {
      if (order.totalPrice) return sum + order.totalPrice;

      // fallback calculation
      const itemsTotal = (order.orderItems || []).reduce(
        (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 0),
        0
      );

      const shipping = order.shippingPrice || 0;

      return sum + itemsTotal + shipping;
    }, 0);

    return {
      totalOrders: orders.length,
      totalSpent,
      pendingOrders: orders.filter(o => o.orderStatus === 'pending').length,
      deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelledOrders: orders.filter(o => o.orderStatus === 'cancelled').length,
      inTransitOrders: orders.filter(o => o.orderStatus === 'in-transit').length,
      lastOrder: orders.length > 0 ? orders[0] : null
    };
  };


  /* ================= FORMAT DATE ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  /* ================= ORDER STATUS BADGE ================= */
  const getOrderStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      "in-transit": "bg-indigo-100 text-indigo-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return (
      <span className={`${baseClasses} ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";

    if (role === 'admin') {
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1`}>
          <Shield size={12} />
          Admin
        </span>
      );
    }

    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1`}>
        <User size={12} />
        Customer
      </span>
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600">Loading users...</p>
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
            Users Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and monitor all user accounts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Users className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.customers}</p>
            </div>
            <User className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <Shield className="text-purple-500" size={24} />
          </div>
        </div>


      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by role:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All Users"],
            ["user", "Customers"],
            ["admin", "Admins"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === key
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {key === 'admin' && <Shield size={14} />}
              {key === 'user' && <User size={14} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Users className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-lg font-semibold text-gray-600">No users found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm
              ? `No users found for "${searchTerm}"`
              : filter !== "all"
                ? `No ${filter === 'admin' ? 'admins' : 'customers'} found`
                : "No users registered yet"}
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
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">User</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('email')}>
                      <div className="flex items-center gap-1">
                        Email
                        {/* {sortConfig.key === 'email' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )} */}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Orders</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Total Spent</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleSort('createdAt')}>
                      <div className="flex items-center gap-1">
                        Joined
                        {sortConfig.key === 'createdAt' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Role</th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const orderStats = getUserOrderStats(user._id);

                    return (
                      <Fragment key={user._id}>
                        <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="text-emerald-600" size={20} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                  User ID: {user._id.slice(-8)}
                                </p>
                              </div>
                              <button
                                onClick={() => toggleRowExpand(user._id)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 ml-auto"
                              >
                                {expandedRows[user._id] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-400" />
                              <span className="text-gray-700">{user.email}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <ShoppingBag size={14} className="text-gray-400" />
                              <span className="font-medium text-gray-800">
                                {orderStats.totalOrders} orders
                              </span>
                              {orderStats.pendingOrders > 0 && (
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                                  {orderStats.pendingOrders} pending
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1 font-medium text-gray-800">
                              <IndianRupee size={14} />
                              {orderStats.totalSpent.toLocaleString('en-IN')}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-gray-700">{formatDate(user.createdAt)}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            {getRoleBadge(user.role)}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => deleteUser(user._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row - User Orders */}
                        {expandedRows[user._id] && (
                          <tr className="bg-gray-50">
                            <td colSpan="7" className="p-4 border-t">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <ShoppingBag size={16} />
                                    Recent Orders ({orderStats.totalOrders})
                                  </h4>
                                  {orderStats.totalOrders > 0 && (
                                    <Link
                                      to={`/admin/orders?user=${user._id}`}
                                      className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                    >
                                      View all orders
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6" />
                                      </svg>
                                    </Link>
                                  )}
                                </div>

                                {orderStats.totalOrders === 0 ? (
                                  <div className="text-center py-8 bg-white rounded-lg border">
                                    <Package className="mx-auto text-gray-300 mb-2" size={32} />
                                    <p className="text-gray-600">No orders yet</p>
                                    <p className="text-sm text-gray-500 mt-1">This user hasn't placed any orders</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {userOrders[user._id]?.slice(0, 3).map((order) => (
                                      <div key={order._id} className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                          <div>
                                            <p className="font-medium text-gray-800">
                                              Order #{order._id.slice(-8)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {formatShortDate(order.createdAt)}
                                            </p>
                                          </div>
                                          {getOrderStatusBadge(order.orderStatus)}
                                        </div>

                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Items:</span>
                                            <span className="font-medium">{order.orderItems.length}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Total:</span>
                                            <span className="font-bold flex items-center gap-1">
                                              <IndianRupee size={12} />
                                              {order.totalPrice.toLocaleString('en-IN')}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Payment:</span>
                                            <span className={`px-2 py-1 rounded text-xs ${order.isPaid
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : 'bg-red-100 text-red-700'
                                              }`}>
                                              {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                          </div>
                                        </div>

                                        <Link
                                          to={`/admin/orders/${order._id}`}
                                          className="mt-3 block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors"
                                        >
                                          View Order Details
                                        </Link>
                                      </div>
                                    ))}

                                    {orderStats.totalOrders > 3 && (
                                      <div className="bg-gray-50 p-4 rounded-lg border border-dashed flex flex-col items-center justify-center">
                                        <Package className="text-gray-400 mb-2" size={24} />
                                        <p className="text-sm text-gray-600">
                                          +{orderStats.totalOrders - 3} more orders
                                        </p>
                                        <Link
                                          to={`/admin/orders?user=${user._id}`}
                                          className="text-xs text-emerald-600 hover:text-emerald-700 mt-2"
                                        >
                                          View all
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Order Stats Summary */}
                                {orderStats.totalOrders > 0 && (
                                  <div className="mt-4 pt-4 border-t">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="text-center">
                                        <p className="text-sm text-gray-500">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-800">{orderStats.totalOrders}</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm text-gray-500">Total Spent</p>
                                        <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                                          <IndianRupee size={18} />
                                          {orderStats.totalSpent.toLocaleString('en-IN')}
                                        </p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm text-gray-500">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm text-gray-500">Delivered</p>
                                        <p className="text-2xl font-bold text-emerald-600">{orderStats.deliveredOrders}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user) => {
              const orderStats = getUserOrderStats(user._id);

              return (
                <div key={user._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <User className="text-emerald-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {user._id.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleRowExpand(user._id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedRows[user._id] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Orders</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <ShoppingBag size={14} />
                        {orderStats.totalOrders}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <IndianRupee size={14} />
                        {orderStats.totalSpent.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Joined</p>
                      <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      {getRoleBadge(user.role)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-gray-200"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-red-200"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Expanded Mobile Content - User Orders */}
                  {expandedRows[user._id] && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <ShoppingBag size={16} />
                        Recent Orders
                      </h4>

                      {orderStats.totalOrders === 0 ? (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <Package className="mx-auto text-gray-300 mb-2" size={24} />
                          <p className="text-gray-600 text-sm">No orders yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {userOrders[user._id]?.slice(0, 2).map((order) => (
                            <div key={order._id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium text-sm">Order #{order._id.slice(-8)}</p>
                                  <p className="text-xs text-gray-500">{formatShortDate(order.createdAt)}</p>
                                </div>
                                {getOrderStatusBadge(order.orderStatus)}
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Items: </span>
                                  <span>{order.orderItems.length}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-gray-500">Total: </span>
                                  <span className="font-bold">₹{order.totalPrice}</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          {orderStats.totalOrders > 2 && (
                            <Link
                              to={`/admin/orders?user=${user._id}`}
                              className="block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 border border-emerald-200 rounded hover:bg-emerald-50"
                            >
                              View all {orderStats.totalOrders} orders
                            </Link>
                          )}

                          {/* Order Stats */}
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Total Spent</p>
                              <p className="font-bold text-emerald-600">₹{orderStats.totalSpent}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Pending Orders</p>
                              <p className="font-bold text-yellow-600">{orderStats.pendingOrders}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={deleteUser}
          orderStats={getUserOrderStats(selectedUser._id)}
          userOrders={userOrders[selectedUser._id] || []}
        />
      )}
    </div>
  );
};

// Separate Modal Component for User Details
const UserDetailsModal = ({ user, onClose, onDelete, orderStats, userOrders }) => {

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
            <p className="text-sm text-gray-500">User ID: {user._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Basic Info */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
                  }`}>
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          {/* <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ShoppingBag size={16} />
              Order Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{orderStats.totalOrders}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <IndianRupee size={18} />
                  {orderStats.totalSpent.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-emerald-600">{orderStats.deliveredOrders}</p>
              </div>
            </div>
          </div> */}

          {/* Recent Orders */}
          {/* {orderStats.totalOrders > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-3">Recent Orders</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {userOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-8)}</p>
                        <p className="text-xs text-gray-500">{formatShortDate(order.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.orderStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {order.orderItems.length} items
                      </span>
                      <span className="font-bold">₹{order.totalPrice}</span>
                    </div>
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="mt-2 block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors"
                    >
                      View Order
                    </Link>
                  </div>
                ))}
              </div>
              {orderStats.totalOrders > 5 && (
                <Link
                  to={`/admin/orders?user=${user._id}`}
                  className="mt-3 block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors"
                >
                  View All {orderStats.totalOrders} Orders
                </Link>
              )}
            </div>
          )} */}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {user.role !== 'admin' && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                    onDelete(user._id);
                    onClose();
                  }
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;