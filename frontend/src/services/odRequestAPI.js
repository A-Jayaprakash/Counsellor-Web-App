import apiClient from "./apiClient";

const odRequestAPI = {
  // Get all OD requests
  getODRequests: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/od-requests?${params}`);
    return response.data;
  },

  // Get single OD request
  getODRequestById: async (id) => {
    const response = await apiClient.get(`/od-requests/${id}`);
    return response.data;
  },

  // Create new OD request
  createODRequest: async (data) => {
    const response = await apiClient.post("/od-requests", data);
    return response.data;
  },

  // Update OD request
  updateODRequest: async (id, data) => {
    const response = await apiClient.put(`/od-requests/${id}`, data);
    return response.data;
  },

  // Delete OD request
  deleteODRequest: async (id) => {
    const response = await apiClient.delete(`/od-requests/${id}`);
    return response.data;
  },

  // Approve OD request
  approveODRequest: async (id, remarks) => {
    const response = await apiClient.post(`/od-requests/${id}/approve`, {
      remarks,
    });
    return response.data;
  },

  // Reject OD request
  rejectODRequest: async (id, remarks) => {
    const response = await apiClient.post(`/od-requests/${id}/reject`, {
      remarks,
    });
    return response.data;
  },

  // Get OD statistics
  getODStats: async () => {
    const response = await apiClient.get("/od-requests/stats");
    return response.data;
  },
};

export default odRequestAPI;
