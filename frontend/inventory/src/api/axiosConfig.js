import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Django backend URL
  timeout: 10000,
});

export default instance;