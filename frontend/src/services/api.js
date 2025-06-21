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

  export const getProducts = (params = {}) => api.get('/products', { params });
  export const createProduct = (data) => api.post('/products', data);
  export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
  export const deleteProduct = (id) => api.delete(`/products/${id}`);
  export const getLots = (params = {}) => api.get('/lots', { params }); // แก้ไข /api//lots เป็น /lots
  export const receiveLot = (data) => api.post('/lots/receive', data);
  export const issueLot = (data) => api.post('/lots/issue', data);
  export const getWarehouses = (params = {}) => api.get('/warehouses', { params });
  export const createWarehouse = (data) => api.post('/warehouses', data);
  export const updateWarehouse = (id, data) => api.put(`/warehouses/${id}`, data);
  export const deleteWarehouse = (id) => api.delete(`/warehouses/${id}`);
  export const recordWaste = (data) => api.post('/waste', data);
  export const getWasteRecords = (params = {}) => api.get('/waste', { params });
  export const transferStock = (data) => api.post('/transactions/transfer', data);
  export const getTransactions = (params = {}) => api.get('/transactions', { params });
  export const loginUser = (data) => api.post('/users/login', data);
  export const registerUser = (data) => api.post('/users/register', data);
  export const getUsers = (params = {}) => api.get('/users', { params });
  export const updateUser = (id, data) => api.put(`/users/${id}`, data);
  export const deleteUser = (id) => api.delete(`/users/${id}`);