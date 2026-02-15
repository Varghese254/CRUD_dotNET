import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-200">

      <div className="bg-blue-900 p-12 rounded-2xl shadow-2xl text-center text-white w-[450px]">

        <h1 className="text-4xl font-bold mb-8">
          Welcome to My App
        </h1>

        <div className="flex gap-6 justify-center">
          
          <Link to="/signin">
            <button className="px-8 py-3 bg-sky-400 text-blue-900 font-semibold rounded-xl hover:bg-sky-500 transition duration-300">
              Sign In
            </button>
          </Link>

          <Link to="/signup">
            <button className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:bg-gray-200 transition duration-300">
              Sign Up
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Welcome;
