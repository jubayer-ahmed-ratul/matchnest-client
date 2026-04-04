import axiosInstance from "./axiosInstance";

export const searchProfiles = (params) => axiosInstance.get("/search", { params });
export const getProfileById = (id) => axiosInstance.get(`/search/${id}`);
export const getWhoViewed = () => axiosInstance.get("/search/who-viewed");
export const getSuggestions = () => axiosInstance.get("/search/suggestions");
