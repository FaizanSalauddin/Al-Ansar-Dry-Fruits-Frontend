import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { cart, setCart } = useCart();
  const cartCount = cart?.items?.length || 0;



  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-[#2F4F3E]"
      : "text-gray-400 hover:text-[#2F4F3E]";

  const ActiveUnderline = () => (
    <span className="absolute -bottom-2 w-5 h-[3px] bg-[#2F4F3E] rounded-full"></span>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#F5EFE6] border-b border-[#e4dccf]">
      <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* ================= BRAND ================= */}
        <Link
          to="/home"
          className="text-xl md:text-2xl font-serif font-bold text-[#2F4F3E]"
        >
          Al-Ansar
        </Link>

        {/* ================= ICON NAV ================= */}
        <div className="flex items-center gap-6 md:gap-10">

          {/* HOME */}
          <Link to="/home" className={`relative flex flex-col items-center ${isActive("/home")}`}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-[11px]">Home</span>
            {location.pathname.startsWith("/home") && <ActiveUnderline />}
          </Link>

          {/* PRODUCTS */}
          <Link to="/products" className={`relative flex flex-col items-center ${isActive("/products")}`}>
            <ShoppingBagIcon className="w-6 h-6" />
            <span className="text-[11px]">Products</span>
            {location.pathname.startsWith("/products") && <ActiveUnderline />}
          </Link>

          {/* CART */}
          <Link to="/cart" className={`relative flex flex-col items-center ${isActive("/cart")}`}>
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="text-[11px]">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -top-2 right-0 bg-[#2F4F3E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}

            {location.pathname.startsWith("/cart") && <ActiveUnderline />}
          </Link>

          {/* PROFILE / LOGIN */}
          {user ? (
            <Link to="/profile" className={`relative flex flex-col items-center ${isActive("/profile")}`}>
              <UserIcon className="w-6 h-6" />
              <span className="text-[11px]">Profile</span>
              {location.pathname.startsWith("/profile") && <ActiveUnderline />}
            </Link>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#2F4F3E] text-white px-3 py-2 rounded-md text-sm"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
