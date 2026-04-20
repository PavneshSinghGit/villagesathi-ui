import axios from "axios";

const BASE_URL = "https://localhost:7092/api";

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/Auth/login`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Server error",
    };
  }
};