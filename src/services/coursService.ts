import axiosInstance from "../interceptor/api";
import type { Cours } from "../types/coursType";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    count?: number;
    total?: number;
    data: T;
}

export const coursService = {
    getAll: async (): Promise<Cours[]> => {
        const response = await axiosInstance.get<ApiResponse<Cours[]>>('/cours/all');
        return response.data.data;
    },

    getOne: async (id: number): Promise<Cours> => {
        const response = await axiosInstance.get<ApiResponse<Cours>>(`/cours/${id}`);
        return response.data.data;
    },

    create: async (data: Partial<Cours>): Promise<ApiResponse<Cours>> => {
        const response = await axiosInstance.post<ApiResponse<Cours>>('/cours/create', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Cours>): Promise<ApiResponse<Cours>> => {
        const response = await axiosInstance.patch<ApiResponse<Cours>>(`/cours/update/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/cours/delete/${id}`);
        return response.data;
    }
};