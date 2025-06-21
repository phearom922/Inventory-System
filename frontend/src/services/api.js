// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found, redirecting to login might be needed');
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access, please login again');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getProducts = (params = {}) => api.get('/api/products', { params });
export const getLots = (params = {}) => api.get('/api/lots', { params });
export const getWasteRecords = (params = {}) => api.get('/api/waste', { params });
export const getWarehouses = (params = {}) => api.get('/api/warehouses', { params });
export const createProduct = (data) => api.post('/api/products', data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

export const receiveLot = (data) => api.post('/api/lots/receive', data); // เพิ่ม /api
export const issueLot = (data) => api.post('/api/lots/issue', data); // เพิ่ม /api
export const createWarehouse = (data) => api.post('/api/warehouses', data); // เพิ่ม /api
export const updateWarehouse = (id, data) => api.put(`/api/warehouses/${id}`, data); // เพิ่ม /api
export const deleteWarehouse = (id) => api.delete(`/api/warehouses/${id}`); // เพิ่ม /api
export const recordWaste = (data) => api.post('/api/waste', data); // เพิ่ม /api

export const transferStock = (data) => api.post('/api/transactions/transfer', data); // เพิ่ม /api
export const getTransactions = (params = {}) => api.get('/api/transactions', { params }); // เพิ่ม /api
export const loginUser = (data) => api.post('/api/users/login', data); // เพิ่ม /api
export const registerUser = (data) => api.post('/api/users/register', data); // เพิ่ม /api
export const getUsers = (params = {}) => api.get('/api/users', { params }); // เพิ่ม /api
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data); // เพิ่ม /api
export const deleteUser = (id) => api.delete(`/api/users/${id}`); // เพิ่ม /api

// สำหรับ Branch
export const getBranches = (params = {}) => api.get('/api/branches', { params });
export const createBranch = (data) => api.post('/api/branches', data);
export const updateBranch = (id, data) => api.put(`/api/branches/${id}`, data);
export const deleteBranch = (id) => api.delete(`/api/branches/${id}`);