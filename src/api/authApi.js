import axios from "axios";

// Ab ye URL aapki .env file se "https://api.villagesathi.in/api" uthayega
const BASE_URL = import.meta.env.VITE_API_URL;

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