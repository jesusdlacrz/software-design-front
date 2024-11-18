import axios from 'axios';
import { API_URL } from '../environmentsVar/envVar';

// Obtener tareas por sprint
export const getTasks = async ( sprintId: number ) => {
  try {
    const response = await axios.get(`${API_URL}tareas/getTareaPerSprint/`,{
      params: { sprint_id: sprintId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener las tareas:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};

export const getUser = async ( userId: number ) => {
  try {
    const response = await axios.get(`${API_URL}usuarios/${userId}/`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener el usuario:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
}

interface NewTask {
  nombre_tarea: string;
  descripcion_tarea: string;
  estado_tarea: string;
  usuario: number;
  sprint: number;
  fecha_fin_tarea: string;
}

export const createTask = async (taskData: NewTask) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${API_URL}tareas/`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al crear la tarea:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId: number) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.delete(`${API_URL}tareas/${taskId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al eliminar la tarea:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
};