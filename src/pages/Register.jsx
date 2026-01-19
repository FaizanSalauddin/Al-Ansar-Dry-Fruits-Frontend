import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userApi from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ IMPORTANT

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const { data } = await userApi.post("/auth/register", {
        name,
        email,
        password,
      });

      // ✅ AUTO LOGIN AFTER REGISTER
      login(data);

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#2F4F3E]">
          Register
        </h2>

        {error && (
          <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          {/* 🔐 PASSWORD WITH EYE */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
