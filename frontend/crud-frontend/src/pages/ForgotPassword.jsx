import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/user/forgot-password", { email });
      setMessage("If your email is registered, you will receive an OTP");
      
      // Store email for next step and navigate to OTP verification
      sessionStorage.setItem("resetEmail", email);
      setTimeout(() => {
        navigate("/verify-otp");
      }, 2000);
      
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl w-[450px] border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-sky-200 text-center mb-8">
          Enter your email to receive OTP
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none"
            placeholder="Email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sky-200">
          Remember your password?{" "}
          <Link to="/signin" className="text-white font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;