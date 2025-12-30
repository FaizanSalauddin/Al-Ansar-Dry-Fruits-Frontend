import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await api.get("/admin/dashboard");
      setStats(data.stats);
    };
    fetchDashboard();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#2F4F3E]">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p>Total Users</p>
          <h2 className="text-xl font-bold">{stats.totalUsers}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Products</p>
          <h2 className="text-xl font-bold">{stats.totalProducts}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Orders</p>
          <h2 className="text-xl font-bold">{stats.totalOrders}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Revenue</p>
          <h2 className="text-xl font-bold">₹{stats.totalRevenue}</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
