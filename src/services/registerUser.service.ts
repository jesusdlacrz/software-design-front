import axios from 'axios';


const API_URL = 'https://legitimate-mada-carlosmendoza-8db81967.koyeb.app/';

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}usuario/`, {
      nombre: name,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al registrar el usuario:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};