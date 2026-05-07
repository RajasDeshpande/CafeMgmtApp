import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
};

export const menuAPI = {
  getAll: () => api.get('/menu'),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
  toggleStock: (id) => api.patch(`/menu/${id}/stock`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/menu/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getToday: () => api.get('/orders/today'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getBill: (id) => api.get(`/orders/${id}/bill`),
};

export const analyticsAPI = {
  getRevenue: () => api.get('/analytics/revenue'),
  getPopular: () => api.get('/analytics/popular'),
  getOverview: () => api.get('/analytics/overview'),
  getRevenueChart: () => api.get('/analytics/revenue-chart'),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
  getPeakHours: () => api.get('/analytics/peak-hours'),
};

export default api;
