
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col">
      {/* Header */}
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

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-800 text-white">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to ScrumManager</h1>
          <p className="text-lg text-gray-300 mb-8">
            Discover the easiest way to manage your projects and collaborate with your team.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-indigo-500 text-white text-lg font-medium rounded-md hover:bg-indigo-600"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-gray-700 text-white text-lg font-medium rounded-md hover:bg-gray-600"
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
            Why Choose MyApp?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center items-center bg-indigo-500 text-white w-16 h-16 rounded-full mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 9.75l-1.5 1.5m0 0l1.5 1.5m-1.5-1.5h8.25M21 12c0-4.418-3.582-8-8-8-4.418 0-8 3.582-8 8 0 4.418 3.582 8 8 8 4.418 0 8-3.582 8-8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Easy to Use</h3>
              <p className="text-gray-500 mt-2">
                A simple and intuitive interface for everyone.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center bg-indigo-500 text-white w-16 h-16 rounded-full mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h11M9 21v-6M9 3v3m0 3c.662 0 1.198-.538 1.198-1.2M9 15c-.662 0-1.198-.538-1.198-1.2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Secure</h3>
              <p className="text-gray-500 mt-2">
                Your data is protected with top-notch security.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center bg-indigo-500 text-white w-16 h-16 rounded-full mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Fast</h3>
              <p className="text-gray-500 mt-2">
                Optimized for performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
          <p className="text-sm text-gray-400">
            &copy; 2024 MyApp. All rights reserved.
          </p>
          <div className="space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
