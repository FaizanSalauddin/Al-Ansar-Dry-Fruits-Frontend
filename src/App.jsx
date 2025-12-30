import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* USER PAGES */
import BannerPage from "./pages/BannerPage";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import OrderSummary from "./pages/OrderSummary";
import PlaceOrder from "./pages/PlaceOrder";
import Profile from "./pages/Profile";

/* LAYOUTS */
import MainLayout from "./layouts/MainLayout";

/* ADMIN */
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminUsers from "./admin/pages/AdminUsers";
import StockReport from "./admin/pages/StockReport";
import EditProduct from "./admin/pages/EditProduct";
import AddProduct from "./admin/pages/AddProduct";

function App() {
  return (
    <>
      <Routes>
        {/* LANDING */}
        <Route path="/" element={<BannerPage />} />

        {/* USER ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stock-report" element={<StockReport />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="light"
      />
    </>
  );
}

export default App;
