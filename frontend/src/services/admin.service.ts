import axios from "axios";
import { Department, UnionPosition } from "../types/profile";
import type { AdminCreateOfficerDto } from "../types/profile";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const adminService = {
  getOfficers: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      department?: Department;
      unionPosition?: UnionPosition;
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

  createOfficer: async (data: AdminCreateOfficerDto) => {
    const response = await axios.post(`${API_URL}/admin/officers`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },
};

export default adminService;
