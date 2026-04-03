import axiosInstance from "./axiosInstance";

export const getAdminStats = () => axiosInstance.get("/admin/stats");
export const getAdminUsers = (params) => axiosInstance.get("/admin/users", { params });
export const getAdminUserDetail = (id) => axiosInstance.get(`/admin/users/${id}`);
export const verifyUser = (id, status) => axiosInstance.put(`/admin/users/${id}/verify`, { status });
export const toggleUserActive = (id) => axiosInstance.put(`/admin/users/${id}/toggle-active`);
