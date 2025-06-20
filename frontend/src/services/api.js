import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
  }
  return config;
});

export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const getLots = () => api.get('/lots');
export const receiveLot = (data) => api.post('/lots/receive', data);
export const issueLot = (data) => api.post('/lots/issue', data);
export const getWarehouses = () => api.get('/warehouses');
export const createWarehouse = (data) => api.post('/warehouses', data);
export const recordWaste = (data) => api.post('/waste', data);
export const getWasteRecords = () => api.get('/waste');
export const transferStock = (data) => api.post('/transactions/transfer', data);
export const getTransactions = () => api.get('/transactions');
export const loginUser = (data) => api.post('/users/login', data);
export const registerUser = (data) => api.post('/users/register', data);
export const getUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);