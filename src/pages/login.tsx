import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginUser.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      console.log('Login response:', response);
      if (response) {
        console.log('Login successful!');
        console.log('User ID:', response.user_id);
        localStorage.setItem('userId', response.user_id);
        toast.success('Login successful!', {
          onClose: () => navigate('/teams'), 
        });
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        style={{
          boxShadow:
            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        className="bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-lg w-full"
      >
        <div className="p-8">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Welcome Back!
          </h2>
          <p className="mt-4 text-center text-gray-400">Sign in to continue</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label className="sr-only" htmlFor="username">Usuario</label>
            <div className="relative">
              <input
                placeholder="Email address"
                className="w-full rounded-lg bg-gray-700 border-gray-300 p-4 pe-12 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="password">Password</label>
            <div className="relative">
              <input
                placeholder="Password"
                className="w-full rounded-lg bg-gray-700 text-white border-gray-300 p-4 pe-12  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </span>
            </div>
          </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-600 rounded"
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                />
                <label className="ml-2 block text-sm text-gray-400" htmlFor="remember-me">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  className="font-medium text-indigo-500 hover:text-indigo-400"
                  href=""
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 ocus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-700 text-center">
          <span className="text-gray-400">Don't have an account?</span> {' '}
          <a className="font-medium text-indigo-500 hover:text-indigo-400" href="/register">
            Sign up
          </a>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
