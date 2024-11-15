import axios from "axios";
import { API_URL } from "../environmentsVar/envVar";

export const getTeamProjects = async (teamId: string) => {
  try {
    const response = await axios.get(`${API_URL}proyectos/getProyectosPerEquipo/`, {
      params: { equipo_id: teamId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener proyectos:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};

export const createProject = async (projectData: {
  nombre_proyecto: string;
  descripcion_proyecto: string;
  fecha_inicio_proyecto: string;
  fecha_fin_proyecto: string;
  estado_proyecto: string;
  equipo_trabajo: number;
}) => {
  try {
    const response = await axios.post(`${API_URL}proyectos/`, projectData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al crear proyecto:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    const response = await axios.delete(`${API_URL}proyectos/${projectId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al eliminar proyecto:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};
