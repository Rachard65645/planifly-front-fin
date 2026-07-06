import axiosInstance from "../interceptor/api";
import type { RegisterData, RegisterResponse } from "../types/registerType";

export const registerService = {
    register: async (userData: RegisterData): Promise<RegisterResponse> => {
        const response = await axiosInstance.post<RegisterResponse>('/register', userData);
        return response.data;
    },
};