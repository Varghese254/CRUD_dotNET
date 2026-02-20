import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    const storedOtp = sessionStorage.getItem("resetOtp");
    
    if (!storedEmail || !storedOtp) {
      // If missing email or OTP, redirect to forgot password
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
      setOtpCode(storedOtp);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Send all required fields including OTP
      const requestData = {
        email: email,
        otpCode: otpCode,  // This is required by your backend
        newPassword: newPassword,
        confirmPassword: confirmPassword
      };

      console.log("Sending reset request:", requestData);

      const response = await api.post("/user/reset-password", requestData);
      
      console.log("Reset response:", response.data);
      
      setMessage("Password reset successfully! Redirecting to login...");
      
      // Clear session storage
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetOtp");
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (error) {
      console.error("Reset password error:", error);
      console.error("Error response:", error.response?.data);
      
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl w-[450px] border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-sky-200 text-center mb-8">
          Enter your new password
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
          <div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none"
              placeholder="New Password"
              required
              minLength="6"
            />
            <p className="text-xs text-sky-200 mt-1">Minimum 6 characters</p>
          </div>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none"
            placeholder="Confirm Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => {
            sessionStorage.clear();
            navigate("/forgot-password");
          }}
          className="mt-4 w-full text-sky-200 hover:text-white transition text-sm"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;