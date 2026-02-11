import { useState, useEffect } from "react";
import userApi from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, RefreshCw } from "lucide-react";

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
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Check if email is from disposable/temporary domain
  const isDisposableEmail = (email) => {
    const disposableDomains = [
      'tempmail', 'temp-mail', 'throwaway', 'fake', 'spam', 'trash',
      '10minutemail', 'guerrillamail', 'mailinator', 'yopmail',
      'sharklasers', 'guerrillamail', 'pokemail', 'spambox',
      'tempmail', 'tempinbox', 'tempemail', 'temp-email', 'tempr',
      'gishpuppy', 'spamgourmet', 'spamex', 'sogetthis', 'mailexpire',
      'mailcatch', 'dispostable', 'mytempemail', 'getnada', 'mailtemp',
      'temp-mail.org', 'tempinbox.com', 'fakeinbox.com', 'throwawaymail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase() || '';
    return disposableDomains.some(d => domain.includes(d));
  };

  // Validate email before sending OTP
  const validateEmailBeforeSend = () => {
    if (!email) {
      setEmailError("Email is required");
      toast.error("Please enter email");
      return false;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address (e.g., name@domain.com)");
      return false;
    }

    if (isDisposableEmail(email)) {
      setEmailError("Please use a permanent email address, not a temporary one");
      toast.error("Please use a permanent email address, not a temporary/disposable one");
      return false;
    }

    setEmailError("");
    return true;
  };

  useEffect(() => {
    let interval;

    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Clear email error when user types
  useEffect(() => {
    if (emailError) setEmailError("");
  }, [email]);

  // SEND OTP
  const sendOtp = async () => {
    try {
      // Validate email before proceeding
      if (!validateEmailBeforeSend()) {
        return;
      }

      setLoading(true);

      const { data } = await userApi.post("/auth/send-otp", { email });

      setIsNewUser(data.isNewUser);
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setOtp("");

      toast.success("OTP sent to your email");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Invalid email address. Please check and try again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    try {
      // Double-check email validation at verification step
      if (!validateEmail(email)) {
        toast.error("Invalid email address. Please start over.");
        setStep(1);
        return;
      }

      if (isNewUser && !name.trim()) {
        return toast.error("Please enter your name");
      }

      if (isNewUser && name.trim().length < 2) {
        return toast.error("Name must be at least 2 characters long");
      }

      setLoading(true);

      const { data } = await userApi.post("/auth/verify-otp", {
        email,
        otp,
        name: isNewUser ? name.trim() : undefined,
      });

      login(data);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Invalid request. Please try again.");
      } else {
        toast.error(err.response?.data?.message || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-6 sm:py-8 lg:py-12 flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2F4F3E] mb-2">
            {step === 1 ? "Welcome Back" : "Verify Email"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            {step === 1
              ? "Enter your email to continue"
              : isNewUser
                ? "Complete your profile to get started"
                : "Enter the verification code sent to your email"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-5 sm:space-y-6">
              {/* Email Input with Error Message */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${emailError
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#2F4F3E] focus:border-[#2F4F3E]"
                      } rounded-lg sm:rounded-xl focus:ring-2 outline-none transition-all`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    onKeyPress={(e) => e.key === "Enter" && sendOtp()}
                  />
                </div>
                {emailError && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {emailError}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use a valid email address (e.g., name@domain.com)
                </p>
              </div>

              {/* Send OTP Button */}
              <button
                onClick={sendOtp}
                disabled={loading || !email}
                className="w-full bg-[#2F4F3E] text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-[#243C30] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 sm:space-y-6">
              {/* Display Email */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm sm:text-base font-medium text-gray-800 break-all">
                  {email}
                </p>
              </div>

              {/* New User Name Input */}
              {isNewUser && (
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2F4F3E] focus:border-[#2F4F3E] outline-none transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && verifyOtp()}
                    />
                  </div>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2F4F3E] focus:border-[#2F4F3E] outline-none transition-all tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6 || (isNewUser && !name.trim())}
                className="w-full bg-[#2F4F3E] text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-[#243C30] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              {/* Resend OTP */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm">
                  <span className="text-gray-600">
                    {canResend
                      ? "Didn't receive the code?"
                      : `Resend code in ${timer}s`}
                  </span>
                  <button
                    onClick={sendOtp}
                    disabled={!canResend || loading}
                    className={`font-medium flex items-center gap-1 transition-colors ${canResend
                        ? "text-[#2F4F3E] hover:text-[#243C30]"
                        : "text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to Step 1 */}
          {step === 2 && (
            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setName("");
                setEmailError("");
              }}
              className="mt-5 sm:mt-6 text-center w-full text-xs sm:text-sm text-gray-500 hover:text-[#2F4F3E] transition-colors"
            >
              ← Use different email
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500 px-4">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;