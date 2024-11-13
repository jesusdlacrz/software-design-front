import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de registro exitoso
    navigate('/login'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

<p className="text-center">
  ¿Ya tienes una cuenta?{' '}
  <a href="/login" className="text-blue-500 hover:underline">
    Inicia sesión aquí
  </a>
</p>


export default Register;
