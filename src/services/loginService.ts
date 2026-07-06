import axiosInstance from "../interceptor/api";
import type { LoginData, LoginResponse } from "../types/login";

export const loginService = {
    login: async (credentials: LoginData): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('/login', credentials);
        return response.data;
    },
};