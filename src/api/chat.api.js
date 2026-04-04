import axiosInstance from "./axiosInstance";

export const sendChatRequest = (toUserId) => axiosInstance.post("/chat/request", { toUserId });
export const respondChatRequest = (chatId, status) => axiosInstance.put(`/chat/${chatId}/respond`, { status });
export const getMyChats = () => axiosInstance.get("/chat");
export const getPendingRequests = () => axiosInstance.get("/chat/pending");
export const getMessages = (chatId) => axiosInstance.get(`/chat/${chatId}/messages`);
export const sendMessage = (chatId, text) => axiosInstance.post(`/chat/${chatId}/messages`, { text });
