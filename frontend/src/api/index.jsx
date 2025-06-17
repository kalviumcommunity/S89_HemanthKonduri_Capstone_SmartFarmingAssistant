import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api/store' });
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const fetchUserData = () => API.get('/data');
export const addNewAddress = (addressData) => API.post('/address', addressData);
export const createOrder = (orderData) => API.post('/order', orderData);