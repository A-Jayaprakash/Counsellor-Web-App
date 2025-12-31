import apiClient from "./apiClient";

const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authAPI;
