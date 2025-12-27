import { Routes, Route } from "react-router-dom";
import BannerPage from "./pages/BannerPage";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";



function App() {
  return (
    <Routes>
      <Route path="/" element={<BannerPage />} />


      {/* Pages with Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

      </Route>
    </Routes>
  );
}

export default App;
