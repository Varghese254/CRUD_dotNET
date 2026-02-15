import { Link } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up attempt with:", { name, email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-professional w-[500px] border border-white/20">
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Create Account
        </h2>
        <p className="text-sky-200 text-center mb-8">
          Join us today! Fill in your details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="john@example.com"
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

          <div>
            <label className="block text-sky-100 mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-200/50 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center text-sm">
            <input 
              type="checkbox" 
              className="mr-2 bg-white/10 border-white/20 rounded" 
              required 
            />
            <label className="text-sky-200">
              I agree to the{' '}
              <a href="#" className="text-white font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-white font-semibold hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:from-sky-500 hover:to-sky-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sky-200">
            Already have an account?{' '}
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