import axiosInstance from "./axiosInstance";

export const generateBio = () => axiosInstance.post("/ai/generate-bio");
export const getCompatibility = (targetUserId) => axiosInstance.post("/ai/compatibility", { targetUserId });
