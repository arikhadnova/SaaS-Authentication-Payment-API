import axios from "axios";

const API_URL = "http://localhost:3000";

// Buat axios instance dengan base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Tambahkan interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth services
export const authService = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
    getMe: () => api.get("/auth/me"),
};

// Payment services
export const paymentService = {
    getProducts: () => api.get("/payment/products"),
    createTransaction: (productId) => api.post("/payment/create", { productId }),
    getHistory: () => api.get("/payment/history"),
};

export default api;