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
