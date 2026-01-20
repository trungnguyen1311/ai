import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const adminService = {
  getOfficers: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      department?: string;
      unionPosition?: string;
      isActive?: string;
    } = {},
  ) => {
    const response = await axios.get(`${API_URL}/admin/officers`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  getOfficerById: async (id: string) => {
    const response = await axios.get(`${API_URL}/admin/officers/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  updateOfficerStatus: async (id: string, isActive: boolean) => {
    const response = await axios.patch(
      `${API_URL}/admin/officers/${id}/status`,
      { isActive },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data;
  },
};

export default adminService;
