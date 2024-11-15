import axios from "axios";
import { API_URL } from "../environmentsVar/envVar";

export const getUserTeams = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}usuariosEquipo/getEquipoTrabajoPerUser/`, {
      params: { usuario_id: userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener equipos:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};
