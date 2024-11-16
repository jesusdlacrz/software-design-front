import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from '../services/registerUser.service'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(name, email, password);
      toast.success('User registered successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error registering user. Please use a valid email.');
      console.error('Error registering user:', error);
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
            Register
          </h2>
          <p className="mt-4 text-center text-gray-400">
          Let's create your account!
          </p>
          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div>
              <label className="sr-only" htmlFor="name">Name</label>
              <div className="relative">
                <input
                  placeholder="Username"
                  className="w-full rounded-lg bg-gray-700 border-gray-300 p-4 pe-12 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <div className="relative">
                <input
                  placeholder="Email address"
                  className="w-full rounded-lg bg-gray-700 border-gray-300 p-4 pe-12 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  placeholder="Password"
                  className="w-full rounded-lg bg-gray-700 border-gray-300 p-4 pe-12 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
    
              <button
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 ocus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-700 text-center">
          <span className="text-gray-400">Already have an account?</span> {' '}
          <a className="font-medium text-indigo-500 hover:text-indigo-400" href="/login">
            Sign In
          </a>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;