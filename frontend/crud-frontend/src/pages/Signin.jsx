import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
const response = await api.post("/user/login", {
  email,
  password
});

const data = response.data;

// ✅ Store token separately
localStorage.setItem("token", data.token);

// ✅ Store user info
localStorage.setItem("user", JSON.stringify({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role
}));

// Role based navigation
if (data.role === "admin") {
  navigate("/admin/home");
} else {
  navigate("/user/home");
}


    } catch (error) {
      setError("Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl w-[450px] border border-white/20">

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-center">
            {error}
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

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:scale-105 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sky-200">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
