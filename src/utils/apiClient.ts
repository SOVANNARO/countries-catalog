import axios from 'axios';
import { API_URL } from '../config/config';

const apiClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;