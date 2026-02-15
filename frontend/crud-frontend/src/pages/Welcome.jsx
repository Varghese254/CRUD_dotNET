import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-professional text-center w-[500px] border border-white/20">
        
        <h1 className="text-5xl font-bold mb-4 text-white">
          Welcome to 
          <span className="bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent block">
            My Professional App
          </span>
        </h1>
        
        <p className="text-sky-100 mb-10 text-lg">
          Your trusted platform for managing everything efficiently
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <Link to="/signin" className="flex-1">
            <button className="w-full px-8 py-4 bg-gradient-to-r from-sky-400 to-sky-500 text-blue-900 font-semibold rounded-xl hover:from-sky-500 hover:to-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Sign In
            </button>
          </Link>

          <Link to="/signup" className="flex-1">
            <button className="w-full px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/40">
              Sign Up
            </button>
          </Link>

        </div>

        <div className="mt-8 text-sky-200 text-sm">
          © 2026 Your Company. All rights reserved.
        </div>

      </div>
    </div>
  );
}

export default Welcome;