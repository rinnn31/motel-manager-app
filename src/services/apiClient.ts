import { SERVER_URL } from '@env';
import axios from 'axios';
import { store } from '../store';
import { refreshToken } from '../store/auth/authSlice';

const apiClient = axios.create({
    baseURL: SERVER_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config: any) => {
    if (config.skipAuth) {
        return config;
    }

    let authData = store.getState().auth;
    if (!authData?.accessToken) {
        return config;
    }

    config.headers['Authorization'] = `Bearer ${authData.accessToken}`;
    return config;
});

let isRefreshingToken = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status !== 401 || originalRequest._retry) return Promise.reject(error);

        console.log("Access token expired, attempting to refresh...");

        if (isRefreshingToken) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return apiClient(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshingToken = true;

        try {
            const authData = store.getState().auth;
            console.log("Current refresh token:", authData);
            if (!authData?.refreshToken) {
                return Promise.reject(error);
            }

            const response =  await store.dispatch(refreshToken({ refreshToken: authData.refreshToken })).unwrap();
            const newAccessToken = response.accessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);
        } catch (err) {
            processQueue(err, null);
            return Promise.reject(err);
        } finally {
            isRefreshingToken = false;
        }
    },
);

export default apiClient;