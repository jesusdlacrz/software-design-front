import axios from 'axios';
import { API_URL } from '../environmentsVar/envVar';

// Obtener sprints por proyecto
export const getSprints = async ( projectId: number ) => {
  try {
    const response = await axios.get(`${API_URL}sprints/getSprintsPerProyecto/`, {
      params: { proyecto_id: projectId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener los sprints:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};

interface NewSprint {
  nombre_sprint: string;
  fecha_inicio: string;
  fecha_fin: string;
  proyecto: number;
}

// Crear sprint en proyecto
export const createSprint = async (sprintData: NewSprint) => {
  try {
    const response = await axios.post(
      `${API_URL}sprints/`,
      sprintData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al crear el sprint:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};

// eliminar un equipo
export const deleteSprint = async (sprintId: number) => {
  try {
    const response = await axios.delete(`${API_URL}sprints/${sprintId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al eliminar el equipo:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};
