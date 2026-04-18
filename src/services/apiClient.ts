import { SERVER_URL } from "@env";
import axios from "axios";
import { useAppSelector } from "../store/hooks";
import { AUTH_DATA_KEY } from "../constants/storage.constants";
import storageService from "./storageService";

const apiClient = axios.create({
    baseURL: SERVER_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(async (config : any) => {
    if (config.skipAuth) {
        return config;
    }

    let authData = useAppSelector((state) => state.auth);
    if (!authData) {
        authData = await storageService.getItem(AUTH_DATA_KEY);
        if (!authData) {
            return config;
        }
    }

    config.headers["Authorization"] = `Bearer ${authData.accessToken}`;
    return config;
});

export default apiClient;