import axiosInstance from "./axiosInstance";

export const getProfile = () => axiosInstance.get("/profile");
export const updateProfile = (data) => axiosInstance.put("/profile", data);
export const updateProfilePhoto = (url) => axiosInstance.put("/profile", { profilePhoto: { url } });
export const requestVerification = (data) => axiosInstance.post("/profile/request-verification", data);
export const addPhoto = (url) => axiosInstance.post("/profile/photos", { url });
export const removePhoto = (index) => axiosInstance.delete(`/profile/photos/${index}`);
