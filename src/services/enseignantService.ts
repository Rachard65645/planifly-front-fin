import axiosInstance from "../interceptor/api";
import type { Enseignant } from "../types/enseignantType";

export const enseignantService = {
    getAll: async () => {
        const response = await axiosInstance.get('/enseignants/all');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await axiosInstance.get(`/enseignants/${id}`);
        return response.data;
    },

    create: async (data: Partial<Enseignant>) => {
        const response = await axiosInstance.post('/enseignants/create', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Enseignant>) => {
        const response = await axiosInstance.patch(`/enseignants/update/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/enseignants/delete/${id}`);
        return response.data;
    }
};