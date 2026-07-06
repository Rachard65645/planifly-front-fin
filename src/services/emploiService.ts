import axiosInstance from "../interceptor/api";
import type { Emploi } from "../types/emploiType";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    total?: number;
    data: T;
}

export const emploiService = {
    getAll: async (): Promise<Emploi[]> => {
        const response = await axiosInstance.get<ApiResponse<Emploi[]>>('/emploi/all');
        return response.data.data;
    },

    getOne: async (id: number): Promise<Emploi> => {
        const response = await axiosInstance.get<ApiResponse<Emploi>>(`/emplois/${id}`);
        return response.data.data;
    },

    create: async (data: Partial<Emploi>): Promise<ApiResponse<Emploi>> => {
        const response = await axiosInstance.post<ApiResponse<Emploi>>('/emploi/create', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Emploi>): Promise<ApiResponse<Emploi>> => {
        const response = await axiosInstance.patch<ApiResponse<Emploi>>(`/emploi/update/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/emploi/delete/${id}`);
        return response.data;
    }
};