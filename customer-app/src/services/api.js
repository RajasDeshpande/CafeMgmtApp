import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getPopular: () => api.get('/menu/popular'),
};

export const orderAPI = {
  place: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getBill: (id) => api.get(`/orders/${id}/bill`),
};

export default api;
