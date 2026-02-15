import { Link } from "react-router-dom";
import { useState } from "react";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-professional w-[450px] border border-white/20">
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-sky-200 text-center mb-8">
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-sky-200">
              <input type="checkbox" className="mr-2 bg-white/10 border-white/20 rounded" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sky-300 hover:text-sky-200 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:from-sky-500 hover:to-sky-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sky-200">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;