import axiosInstance from "./axiosInstance";

export const sendMessage = (data) => axiosInstance.post("/messages", data);
export const getMessages = () => axiosInstance.get("/messages");
export const markAsRead = (id) => axiosInstance.put(`/messages/${id}/read`);
export const deleteMessage = (id) => axiosInstance.delete(`/messages/${id}`);
