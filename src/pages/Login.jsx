import { useState, useEffect } from "react";
import userApi from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const [step, setStep] = useState(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;

    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  // SEND OTP
  const sendOtp = async () => {
    try {
      if (!email) return toast.error("Please enter email");

      setLoading(true);

      const { data } = await userApi.post("/auth/send-otp", { email });

      setIsNewUser(data.isNewUser);
      setStep(2);

      setTimer(30);          // 👈 RESET TIMER
      setCanResend(false);   // 👈 DISABLE RESEND

      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };


  // VERIFY OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);

      const { data } = await userApi.post("/auth/verify-otp", {
        email,
        otp,
        name: isNewUser ? name : undefined,
      });

      login(data);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">

        <h2 className="text-2xl font-bold text-center text-[#2F4F3E]">
          Login / Register
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border px-4 py-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {canResend ? "Didn't receive OTP?" : `Resend OTP in ${timer}s`}
              </span>

              <button
                disabled={!canResend || loading}
                onClick={sendOtp}
                className={`font-semibold ${canResend
                  ? "text-[#2F4F3E]"
                  : "text-gray-400 cursor-not-allowed"
                  }`}
              >
                Resend OTP
              </button>
            </div>

          </>
        )}

        {step === 2 && (
          <>
            {isNewUser && (
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border px-4 py-2 rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border px-4 py-2 rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {canResend ? "Didn't receive OTP?" : `Resend OTP in ${timer}s`}
              </span>

              <button
                disabled={!canResend || loading}
                onClick={sendOtp}
                className={`font-semibold ${canResend
                  ? "text-[#2F4F3E]"
                  : "text-gray-400 cursor-not-allowed"
                  }`}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
