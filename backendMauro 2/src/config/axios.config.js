import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api', // Cambia al URL de tu backend.
    timeout: 5000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Agrega el token de autenticación si es necesario
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
