import axiosInstance from "./axiosInstance";

export const sendInterest = (receiverId, note) => axiosInstance.post(`/interest/send/${receiverId}`, { note });
export const respondToInterest = (interestId, status) => axiosInstance.put(`/interest/respond/${interestId}`, { status });
export const getReceivedInterests = () => axiosInstance.get("/interest/received");
export const getSentInterests = () => axiosInstance.get("/interest/sent");
export const getMatches = () => axiosInstance.get("/interest/matches");
export const cancelInterest = (interestId) => axiosInstance.delete(`/interest/cancel/${interestId}`);
