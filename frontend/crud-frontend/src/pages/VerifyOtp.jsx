import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/user/verify-otp", { 
        email, 
        otpCode: otp 
      });
      
      console.log("Verify OTP response:", response.data);
      
      // Store both email and OTP in sessionStorage for the reset password page
      sessionStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetOtp", otp);
      
      setMessage("OTP verified successfully! Redirecting...");
      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);
      
    } catch (error) {
      console.error("Verify OTP error:", error);
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl w-[450px] border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Verify OTP
        </h2>
        <p className="text-sky-200 text-center mb-8">
          Enter the 6-digit code sent to your email
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 text-green-200 p-3 rounded-xl mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none text-center text-2xl tracking-widest"
            placeholder="000000"
            maxLength="6"
            required
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={() => {
            sessionStorage.removeItem("resetEmail");
            navigate("/forgot-password");
          }}
          className="mt-4 w-full text-sky-200 hover:text-white transition"
        >
          Try with different email
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;