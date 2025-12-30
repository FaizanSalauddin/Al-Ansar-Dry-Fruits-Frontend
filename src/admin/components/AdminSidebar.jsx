import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? "bg-[#2F4F3E] text-white"
        : "hover:bg-[#e4dccf]"
    }`;

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <h2 className="text-xl font-bold p-4 text-[#2F4F3E]">
        Admin Panel
      </h2>

      <nav className="space-y-1 px-2">
        <Link to="/admin" className={linkClass("/admin")}>
          Dashboard
        </Link>

        <Link to="/admin/products" className={linkClass("/admin/products")}>
          Products
        </Link>

        <Link to="/admin/orders" className={linkClass("/admin/orders")}>
          Orders
        </Link>

        <Link to="/admin/users" className={linkClass("/admin/users")}>
          Users
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
