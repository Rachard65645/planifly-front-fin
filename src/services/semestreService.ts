import axiosInstance from "../interceptor/api";
import type { Semestre } from "../types/semestreType";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    count?: number;
    total?: number;
    data: T;
}

export const semestreService = {
    getAll: async (): Promise<Semestre[]> => {
        const response = await axiosInstance.get<ApiResponse<Semestre[]>>('/semestre/all');
        return response.data.data;
    },

    getOne: async (id: number): Promise<Semestre> => {
        const response = await axiosInstance.get<ApiResponse<Semestre>>(`/semestre/${id}`);
        return response.data.data;
    },

    create: async (data: { numero: number; anneeUniversitaire: string }): Promise<ApiResponse<Semestre>> => {
        const response = await axiosInstance.post<ApiResponse<Semestre>>('/semestre/create', data);
        return response.data;
    },

    update: async (id: number, data: { numero: number; anneeUniversitaire: string }): Promise<ApiResponse<Semestre>> => {
        const response = await axiosInstance.patch<ApiResponse<Semestre>>(`/semestre/update/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/semestre/delete/${id}`);
        return response.data;
    }
};