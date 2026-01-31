import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const useAnimatedPlaceholder = (
  prefix,
  words,
  speed = 100,
  pause = 1500
) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout;

    if (!isDeleting) {
      // typing
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      // deleting
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, speed / 0.99);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, speed, pause]);

  return `${prefix}${text}`;
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearchOnRoutes = [
    "/cart",
    "/profile",
    "/my-orders",
    "/checkout",
    "/order-summary",
    "/orders",
    "/place-order"
  ];

  const shouldHideSearch = hideSearchOnRoutes.some((path) =>
    location.pathname.startsWith(path)
  );


  const { user } = useAuth();
  const { cart } = useCart();
  const cartCount = cart?.items?.length || 0;

  const [searchValue, setSearchValue] = useState("");

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-[#2F4F3E]"
      : "text-gray-400 hover:text-[#2F4F3E]";

  const ActiveUnderline = () => (
    <span className="absolute -bottom-2 w-5 h-[3px] bg-[#2F4F3E] rounded-full"></span>
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${searchValue.trim()}`);
    }
  };
  const clearSearch = () => {
    setSearchValue("");
    navigate("/home");
  };
  const animatedPlaceholder = useAnimatedPlaceholder(
    "Search For ",
    ["Dry Fruits...", "Dates... ", "Raisins... ", "Ajwa Dates... ", "Almonds... ", "Pistachios... ", "Cashews... ", "Walnuts... "]
  );


  return (
    <header className="sticky top-0 z-50 bg-[#F5EFE6] border-b border-[#e4dccf]">
      <nav className="max-w-7xl mx-auto px-4 py-2">

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center justify-between gap-6">

          {/* BRAND */}
          <Link
            to="/home"
            className="text-2xl font-serif font-bold text-[#2F4F3E] whitespace-nowrap"
          >
            Al-Ansar
          </Link>

          {/* SEARCH (CENTER) */}
          {!shouldHideSearch && (
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white border border-[#e4dccf] rounded-full px-4 py-2 shadow-sm w-full max-w-lg"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchValue ? "Search For" : animatedPlaceholder}
                className="w-full outline-none text-sm bg-transparent pr-8"
              />

              {/* ❌ CLEAR BUTTON */}
              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 text-gray-400 hover:text-gray-700 text-lg"
                >
                  ×
                </button>
              )}
            </form>
          )}


          {/* ICONS */}
          <div className="flex items-center gap-8">
            <Link to="/home" className={`relative flex flex-col items-center ${isActive("/home")}`}>
              <HomeIcon className="w-6 h-6" />
              <span className="text-[11px]">Home</span>
              {location.pathname.startsWith("/home") && <ActiveUnderline />}
            </Link>

            <Link to="/products" className={`relative flex flex-col items-center ${isActive("/products")}`}>
              <ShoppingBagIcon className="w-6 h-6" />
              <span className="text-[11px]">Products</span>
              {location.pathname.startsWith("/products") && <ActiveUnderline />}
            </Link>

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
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden">

          {/* TOP ROW */}
          <div className="flex items-center">

            {/* BRAND LEFT */}
            <Link
              to="/home"
              className="text-xl font-serif font-bold text-[#2F4F3E]"
            >
              Al-Ansar
            </Link>

            {/* ICONS RIGHT */}
            <div className="ml-auto flex items-center gap-6">
              <Link to="/home" className={isActive("/home")}>
                <HomeIcon className="w-6 h-6" />
              </Link>

              <Link to="/products" className={isActive("/products")}>
                <ShoppingBagIcon className="w-6 h-6" />
              </Link>

              <Link to="/cart" className={`relative ${isActive("/cart")}`}>
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2F4F3E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <Link to="/profile" className={isActive("/profile")}>
                  <UserIcon className="w-6 h-6" />
                </Link>
              ) : (
                <button onClick={() => navigate("/login")}>
                  <UserIcon className="w-6 h-6 text-[#2F4F3E]" />
                </button>
              )}
            </div>
          </div>

          {/* SEARCH BELOW */}
          {!shouldHideSearch && (
            <form
              onSubmit={handleSearchSubmit}
              className="relative mt-3 flex items-center bg-white border border-[#e4dccf] rounded-full px-4 py-2 shadow-sm"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchValue ? "Search For" : animatedPlaceholder}
                className="w-full outline-none text-sm bg-transparent pr-8"
              />

              {/* ❌ CLEAR BUTTON */}
              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 text-gray-400 hover:text-gray-700 text-lg"
                >
                  ×
                </button>
              )}
            </form>
          )}

        </div>

      </nav>
    </header>
  );
}

export default Navbar;
