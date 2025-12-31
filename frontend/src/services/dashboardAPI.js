import apiClient from "./apiClient";

const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  // Get announcements
  getAnnouncements: async (limit = 10) => {
    const response = await apiClient.get(
      `/dashboard/announcements?limit=${limit}`
    );
    return response.data;
  },

  // Get recent activities
  getActivities: async (limit = 10) => {
    const response = await apiClient.get(
      `/dashboard/activities?limit=${limit}`
    );
    return response.data;
  },
};

export default dashboardAPI;
