import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const cartCount = cart?.items?.length || 0;

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    navigate("/login");
  };

  return (
    <header className="bg-[#F5EFE6] border-b border-[#e4dccf] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <Link
          to="/home"
          className="text-2xl font-serif text-[#2F4F3E] font-bold"
        >
          Al-Ansar
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-6 text-[#2F4F3E] font-medium">
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#2F4F3E] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!userInfo ? (
            <Link
              to="/login"
              className="bg-[#2F4F3E] text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          ) : (
            <>
              {/* ✅ MY PROFILE */}
              <Link to="/profile" className="hover:underline">
                My Profile
              </Link>

              <Link to="/my-orders" className="hover:underline">
                My Orders
              </Link>

              <button
                onClick={logoutHandler}
                className="bg-[#2F4F3E] text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ================= MOBILE HAMBURGER ================= */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#2F4F3E] relative"
        >
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#2F4F3E] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h18M3 12h18M3 18h18"
            />
          </svg>
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-[#F5EFE6] px-4 pb-4">
          <div className="flex flex-col gap-4 text-[#2F4F3E] font-medium">

            <Link onClick={() => setOpen(false)} to="/home">
              Home
            </Link>

            <Link onClick={() => setOpen(false)} to="/products">
              Products
            </Link>

            {/* Cart */}
            <Link
              onClick={() => setOpen(false)}
              to="/cart"
              className="flex justify-between items-center"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#2F4F3E] text-white text-xs px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {!userInfo ? (
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="bg-[#2F4F3E] text-white px-4 py-2 rounded-md text-center"
              >
                Login
              </Link>
            ) : (
              <>
                {/* ✅ MY PROFILE (MOBILE) */}
                <Link
                  onClick={() => setOpen(false)}
                  to="/profile"
                >
                  My Profile
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  to="/my-orders"
                >
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    logoutHandler();
                  }}
                  className="bg-[#2F4F3E] text-white px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
