// src/services/usuariosPorEquipo.service.ts
import axios from 'axios';
import { API_URL } from '../environmentsVar/envVar';

export const getUsersByTeam = async (teamId: number) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}usuariosEquipo/getUserPerEquipoTrabajo`, 
      {
        params: { equipo_trabajo_id: teamId },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener los usuarios del equipo:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};