import axios from 'axios';

// 1. Definimos a URL base da nossa API
// CÓDIGO CORRIGIDO
const api = axios.create({
  baseURL: 'https://titogo.onrender.com', // <-- ESTA É A MUDANÇA
});

// 2. O "Intercetor": A parte mais importante
// Isto vai "intercetar" TODOS os pedidos que saem da nossa app
// e adicionar o token de autenticação automaticamente.

api.interceptors.request.use(
  (config) => {
    // 3. Pegamos o token que guardámos no navegador (no localStorage)
    const token = localStorage.getItem('token');
    
    // 4. Se o token existir, adicionamo-lo ao cabeçalho (header) 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Se houver um erro na configuração do pedido
    return Promise.reject(error);
  }
);

export default api;