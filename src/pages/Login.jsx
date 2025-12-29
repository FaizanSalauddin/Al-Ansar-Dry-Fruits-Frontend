import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const submitHandler = async (e) => {
  e.preventDefault();
  setError("");

  try {
    setLoading(true);

    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));

    toast.success("Login successful", {
      style: {
        background: "#2F4F3E",
        color: "#fff",
      },
    });

    // ⏳ IMPORTANT: delay navigation
    setTimeout(() => {
      navigate("/home");
    }, 1200);

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Login failed",
      {
        style: {
          background: "#8B0000",
          color: "#fff",
        },
      }
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#2F4F3E]">
          Login
        </h2>

        {error && (
          <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          New user?{" "}
          <Link to="/register" className="text-green-700 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
