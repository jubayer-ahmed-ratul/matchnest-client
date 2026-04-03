import axiosInstance from "./axiosInstance";

export const registerUser = (data) => axiosInstance.post("/auth/register", data);
export const loginUser = (data) => axiosInstance.post("/auth/login", data);
export const googleLogin = (idToken) => axiosInstance.post("/auth/google", { idToken });
export const getMe = () => axiosInstance.get("/auth/me");
