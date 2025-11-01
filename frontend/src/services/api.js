import axios from 'axios';

// 1. Definimos a URL base do nosso backend LOCAL
const api = axios.create({
  // 2. [A CORREÇÃO] Certifique-se que tem as aspas
  baseURL: 'https://titogo.onrender.com', 
});

/**
 * Intercetor de Pedidos (Request Interceptor)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;