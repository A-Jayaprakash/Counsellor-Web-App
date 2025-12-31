import apiClient from "./apiClient";

const attendanceAPI = {
  // Get student attendance
  getAttendance: async (studentId) => {
    const response = await apiClient.get(`/attendance/${studentId}`);
    return response.data;
  },

  // Get attendance by subject
  getAttendanceBySubject: async (studentId) => {
    const response = await apiClient.get(`/attendance/${studentId}/subjects`);
    return response.data;
  },

  // Get all students attendance (for counsellors)
  getStudentsAttendance: async () => {
    const response = await apiClient.get("/attendance/counsellor/students");
    return response.data;
  },
};

export default attendanceAPI;
