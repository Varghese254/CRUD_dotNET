import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/user/register", {
        name,
        email,
        password
      });

      alert("Registration successful!");
      navigate("/signin");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-600 to-blue-900">

      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[450px] border border-white/20">

        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Create Account
        </h2>

        <p className="text-sky-200 text-center mb-8">
          Join us today! Fill in your details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Terms */}
          <div className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2 accent-sky-400"
              required
            />
            <label className="text-sky-200">
              I agree to the{" "}
              <span className="text-white font-semibold hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-white font-semibold hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:from-sky-500 hover:to-sky-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-sky-200">
            Already have an account?{" "}
            <Link to="/signin" className="text-white font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-sky-200/50 text-xs">
          By signing up, you agree to our Terms and Privacy Policy
        </div>

      </div>
    </div>
  );
}

export default Signup;
