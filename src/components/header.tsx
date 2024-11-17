
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ScrumManager</h1>
        <nav className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-indigo-500 text-sm rounded-md hover:bg-indigo-600"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-gray-700 text-sm rounded-md hover:bg-gray-600"
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;