import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#F5EFE6] border-b border-[#e4dccf]">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/home"
          className="text-2xl font-serif text-[#2F4F3E] font-bold"
        >
          Al-Ansar
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-[#2F4F3E] font-medium">
          <Link to="/home" className="hover:underline">
            Home
          </Link>
          <Link to="/products" className="hover:underline">
            Products
          </Link>
          <Link to="/cart" className="hover:underline">
            Cart
          </Link>
          <Link
            to="/login"
            className="bg-[#2F4F3E] text-white px-4 py-2 rounded-md hover:bg-[#243C30] transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#2F4F3E]"
          aria-label="Toggle menu"
        >
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

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#F5EFE6] px-4 pb-4">
          <div className="flex flex-col gap-4 text-[#2F4F3E] font-medium">
            <Link onClick={() => setOpen(false)} to="/home">
              Home
            </Link>
            <Link onClick={() => setOpen(false)} to="/products">
              Products
            </Link>
            <Link onClick={() => setOpen(false)} to="/cart">
              Cart
            </Link>
            <Link
              onClick={() => setOpen(false)}
              to="/login"
              className="bg-[#2F4F3E] text-white px-4 py-2 rounded-md text-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
