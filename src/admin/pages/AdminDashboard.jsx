import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // States for dynamic filtering
  const [revenueTimeframe, setRevenueTimeframe] = useState("today");
  const [chartTimeframe, setChartTimeframe] = useState("daily");
  const [customDate, setCustomDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateSelected, setCustomDateSelected] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (timeframe = null, date = null) => {
    setLoading(true);
    try {
      const params = {};
      if (timeframe) params.timeframe = timeframe;
      if (date) {
        params.date = date.toISOString().split('T')[0];
        params.timeframe = "custom";
      }

      const { data } = await adminApi.get("/admin/dashboard", { params });
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueTimeframeChange = (value) => {
    setRevenueTimeframe(value);
    setShowDatePicker(false);

    if (value === "custom") {
      setShowDatePicker(true);
      return;
    }

    fetchDashboard(value);
  };

  const handleCustomDateSubmit = () => {
    setCustomDateSelected(true);
    setRevenueTimeframe("custom");
    fetchDashboard("custom", customDate);
    setShowDatePicker(false);
  };

  const handleCustomDateCancel = () => {
    setShowDatePicker(false);
    if (!customDateSelected) {
      setRevenueTimeframe("today");
      fetchDashboard("today");
    }
  };

  const handleCustomDateChange = (date) => {
    setCustomDate(date);
  };

  const getRevenueByTime = () => {
    if (!stats) return 0;

    switch (revenueTimeframe) {
      case "today":
        return stats.todayRevenue || 0;
      case "thisWeek":
        return stats.weeklyRevenue || 0;
      case "thisMonth":
        return stats.monthlyRevenue || 0;
      case "thisYear":
        return stats.yearlyRevenue || 0;
      case "custom":
        return stats.customDateRevenue || 0;
      default:
        return stats.totalRevenue;
    }
  };

  const getRevenueLabel = () => {
    switch (revenueTimeframe) {
      case "today":
        return "Today's Revenue";
      case "thisWeek":
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return `This Week (${weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;

      case "thisMonth":
        const monthName = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        return `${monthName} Revenue`;

      case "thisYear":
        return `${new Date().getFullYear()} Revenue`;

      case "custom":
        if (customDateSelected) {
          return `Revenue for ${customDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
          })}`;
        }
        return "Select Custom Date";

      default:
        return "Total Revenue";
    }
  };

  const getChartData = () => {
    if (!stats) return [];

    switch (chartTimeframe) {
      case "daily":
        return stats.dailyData || [];
      case "weekly":
        return stats.weeklyData || [];
      case "monthly":
        return stats.monthlyData || [];
      case "yearly":
        return stats.yearlyData || [];
      default:
        return stats.monthlyData || [];
    }
  };

  const getChartSubtitle = () => {
    if (!stats) return "";

    switch (chartTimeframe) {
      case "daily":
        return "Last 7 days";
      case "weekly":
        return "Last 4 weeks";
      case "monthly":
        return "Last 6 months";
      case "yearly":
        return "Last 5 years";
      default:
        return "";
    }
  };

  const getXAxisLabel = (data) => {
    if (!data || data.length === 0) return "";

    if (chartTimeframe === "monthly" && data[0].fullMonth) {
      const months = data.map(item => item.name);
      return `${months[0]} - ${months[months.length - 1]}`;
    }

    if (chartTimeframe === "weekly" && data[0].dateRange) {
      const firstWeek = data[0].dateRange;
      const lastWeek = data[data.length - 1].dateRange;
      return `${firstWeek} to ${lastWeek}`;
    }

    if (chartTimeframe === "daily" && data[0].fullDate) {
      const firstDate = data[0].fullDate;
      const lastDate = data[data.length - 1].fullDate;
      return `${firstDate} - ${lastDate}`;
    }

    if (chartTimeframe === "yearly") {
      const years = data.map(item => item.name);
      return `${years[0]} - ${years[years.length - 1]}`;
    }

    return "";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">
            {data.fullDate || data.dateRange || data.fullMonth || data.name}
          </p>
          <p className="text-emerald-600 font-bold">₹{payload[0].value}</p>
          <p className="text-xs text-gray-500">
            {chartTimeframe === 'daily' ? 'Daily Revenue' :
              chartTimeframe === 'weekly' ? 'Weekly Revenue' :
                chartTimeframe === 'monthly' ? 'Monthly Revenue' : 'Yearly Revenue'}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-emerald-600 font-semibold">Loading Futuristic Analytics...</div>;
  if (!stats) return <div className="flex justify-center items-center h-screen text-red-600 font-semibold">Failed to load analytics</div>;

  const pieData = [
    { name: "Paid", value: stats.paidOrders, color: "#10B981" },
    { name: "Unpaid", value: stats.unpaidOrders, color: "#EF4444" },
  ];

  const chartData = getChartData();
  const chartSubtitle = getChartSubtitle();
  const xAxisLabel = getXAxisLabel(chartData);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          System <span className="text-emerald-600">Analytics</span>
        </h1>
        <p className="text-gray-500">Real-time performance overview</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[
          { label: "Total Users", val: stats.totalUsers, icon: "👥", color: "blue" },
          { label: "Products", val: stats.totalProducts, icon: "📦", color: "indigo" },
          { label: "Total Orders", val: stats.totalOrders, icon: "🛒", color: "amber" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-sm text-gray-500 font-medium uppercase">{item.label}</p>
            <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(item.val)}</h2>
          </div>
        ))}

        {/* Dynamic Net Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 bg-emerald-50/30 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="text-3xl">💰</div>
            <div className="relative">
              <select
                className="text-sm bg-white border border-gray-300 rounded-lg p-2 pr-8 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer"
                value={revenueTimeframe}
                onChange={(e) => handleRevenueTimeframeChange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Date</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {showDatePicker && revenueTimeframe === "custom" && (
            <div className="absolute top-24 right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-10 min-w-[280px]">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <DatePicker
                  selected={customDate}
                  onChange={handleCustomDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  maxDate={new Date()}
                  minDate={new Date('2020-01-01')}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                  todayButton="Today"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCustomDateSubmit}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Apply Date
                </button>
                <button
                  onClick={handleCustomDateCancel}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Select any date to view revenue
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 font-medium uppercase">{getRevenueLabel()}</p>
          <h2 className="text-2xl font-bold text-emerald-700">₹{formatCurrency(getRevenueByTime())}</h2>

          {revenueTimeframe === "custom" && !showDatePicker && customDateSelected && (
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setShowDatePicker(true)}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Change Date
              </button>
              <div className="text-xs text-gray-500">
                Selected: {customDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          )}

          {revenueTimeframe === "custom" && !showDatePicker && !customDateSelected && (
            <div className="mt-4">
              <button
                onClick={() => setShowDatePicker(true)}
                className="w-full py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Click to Select Date
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-gray-700">
                Revenue Trends
              </h3>

              <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                {[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setChartTimeframe(t.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap ${chartTimeframe === t.value
                      ? "bg-white shadow-sm text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {chartSubtitle}
              {xAxisLabel && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded block sm:inline mt-1 sm:mt-0">
                  {xAxisLabel}
                </span>
              )}
            </p>
          </div>

          <div className="w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  minTickGap={8}
                  angle={0}
                  height={40}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${formatCurrency(value)}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-700">Order Payment Status</h3>
              <p className="text-sm text-gray-500">Real-time payment status distribution</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.totalOrders)}
              </div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
          </div>

          <div className="w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={8}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={2}
                      stroke="#fff"
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>


      {/* Additional Information Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-2">Revenue Insights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex justify-between">
              <span>Today's Revenue:</span>
              <span className="font-medium">₹{formatCurrency(stats.todayRevenue || 0)}</span>
            </li>
            <li className="flex justify-between">
              <span>This Month's Revenue:</span>
              <span className="font-medium">₹{formatCurrency(stats.monthlyRevenue || 0)}</span>
            </li>
            <li className="flex justify-between">
              <span>Paid Order Percentage:</span>
              <span className="font-medium text-emerald-600">
                {((stats.paidOrders / stats.totalOrders) * 100 || 0).toFixed(1)}%
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-2">Chart Information</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span>Bar Chart shows revenue trends</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
              <span>Paid Orders: {formatCurrency(stats.paidOrders)}</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }}></div>
              <span>Unpaid Orders: {formatCurrency(stats.unpaidOrders)}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-2">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setChartTimeframe('daily');
                setRevenueTimeframe('today');
                fetchDashboard('today');
              }}
              className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
            >
              Today's View
            </button>
            <button
              onClick={() => {
                setChartTimeframe('weekly');
                setRevenueTimeframe('thisWeek');
                fetchDashboard('thisWeek');
              }}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              Weekly View
            </button>
            <button
              onClick={() => {
                setChartTimeframe('monthly');
                setRevenueTimeframe('thisMonth');
                fetchDashboard('thisMonth');
              }}
              className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
            >
              Monthly View
            </button>
            <button
              onClick={() => handleRevenueTimeframeChange('custom')}
              className="px-3 py-1.5 text-xs bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"
            >
              Custom Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;