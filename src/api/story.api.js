import axiosInstance from "./axiosInstance";

export const getApprovedStories = () => axiosInstance.get("/stories");
export const submitStory = (data) => axiosInstance.post("/stories", data);
export const getAdminStories = (status) => axiosInstance.get("/stories/admin", { params: { status } });
export const adminAddStory = (data) => axiosInstance.post("/stories/admin", data);
export const updateStoryStatus = (id, status) => axiosInstance.put(`/stories/${id}/status`, { status });
export const deleteStory = (id) => axiosInstance.delete(`/stories/${id}`);
