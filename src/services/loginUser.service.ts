import axios from "axios";
import { API_URL } from "../environmentsVar/envVar";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}login/`, {
        email: email,
        password: password,
      });
      // await axios.get(`${API_URL}Endpoint/`,{
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      //   }
      // } )
    const { access, refresh } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    // Asi se implementa del authorization
    // axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al iniciar sesión:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};
