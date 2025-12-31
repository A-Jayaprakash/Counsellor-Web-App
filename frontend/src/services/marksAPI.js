import apiClient from "./apiClient";

const marksAPI = {
  // Get student marks
  getMarks: async (studentId) => {
    const response = await apiClient.get(`/marks/${studentId}`);
    return response.data;
  },

  // Get marks summary
  getMarksSummary: async (studentId) => {
    const response = await apiClient.get(`/marks/${studentId}/summary`);
    return response.data;
  },
};

export default marksAPI;
