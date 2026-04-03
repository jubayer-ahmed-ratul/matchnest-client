import axiosInstance from "./axiosInstance";

export const createCheckout = (plan) => axiosInstance.post("/payment/checkout", { plan });
export const confirmPayment = (plan) => axiosInstance.post("/payment/confirm", { plan });
export const getPaymentList = () => axiosInstance.get("/payment/list");
