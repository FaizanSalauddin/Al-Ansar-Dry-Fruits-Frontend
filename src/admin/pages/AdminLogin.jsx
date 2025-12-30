import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminInfo", JSON.stringify(data));
      toast.success("Admin logged in");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          placeholder="Email"
          className="border w-full p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-[#2F4F3E] text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
