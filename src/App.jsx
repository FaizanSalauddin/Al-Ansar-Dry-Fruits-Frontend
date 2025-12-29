import { Routes, Route } from "react-router-dom";
import BannerPage from "./pages/BannerPage";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import OrderSummary from "./pages/OrderSummary";
import PlaceOrder from "./pages/PlaceOrder";
import Profile from "./pages/Profile";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BannerPage />} />
        {/* Pages with Navbar */}
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
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
