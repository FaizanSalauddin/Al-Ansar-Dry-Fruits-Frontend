import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      // Backend se filtered data mangwayein
      const { data } = await adminApi.get("/admin/dashboard");
      setStats(data.stats);
    };
    fetchDashboard();
  }, []);

  if (!stats) return <div className="flex justify-center items-center h-screen text-emerald-600 font-semibold">Loading Futuristic Analytics...</div>;

  // Pie Chart Data (Categorizing orders)
  const pieData = [
    { name: "Paid", value: stats.paidOrders, color: "#10B981" },
    { name: "Unpaid", value: stats.unpaidOrders, color: "#EF4444" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          System <span className="text-emerald-600">Analytics</span>
        </h1>
        <p className="text-gray-500">Real-time performance overview</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Users", val: stats.totalUsers, icon: "👥", color: "blue" },
          { label: "Products", val: stats.totalProducts, icon: "📦", color: "indigo" },
          { label: "Total Orders", val: stats.totalOrders, icon: "🛒", color: "amber" },
          { label: "Net Revenue", val: `₹${stats.totalRevenue}`, icon: "💰", color: "emerald" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
            <h2 className="text-2xl font-bold text-gray-800">{item.val}</h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Revenue/Sales Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Monthly Revenue</h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Order Payment Status</h3>
          <div className="w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;