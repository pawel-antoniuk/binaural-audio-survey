import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

const API_URL = config.surveyService.baseUrl;

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// apiClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
