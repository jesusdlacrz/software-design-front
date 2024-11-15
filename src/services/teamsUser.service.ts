import axios from "axios";
import { API_URL } from "../environmentsVar/envVar";

// obtener equipos de trabajo por usuario
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

// crear un nuevo equipo y asignarlo al usuario como creador
export const createTeam = async (userId: string, nombre_equipo: string, descripcion_equipo: string) => {
  try {
    const equipoResponse = await axios.post(
      `${API_URL}equipos/`,
      {
        usuario_id: userId,
        nombre_equipo,
        descripcion_equipo,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newTeam = equipoResponse.data;
    await axios.post(
      `${API_URL}usuariosEquipo/`,
      {
        usuario: userId,
        equipo_trabajo: newTeam.id, 
        es_creador: true,
        fecha_union: new Date().toISOString().split("T")[0], 
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return newTeam;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al crear el equipo:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al crear el equipo");
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Error desconocido al crear el equipo");
    }
  }
};

// eliminar un equipo
export const deleteTeam = async (teamId: number) => {
  try {
    const response = await axios.delete(`${API_URL}equipos/${teamId}/`, {
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


// eliminar usuario del equipo
export const deleteUsuarioEquipo = async (usuarioEquipoId: number) => {
  try {
    const response = await axios.delete(`${API_URL}usuariosEquipo/${usuarioEquipoId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al eliminar usuario del equipo:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};
