import axiosInstance from "../interceptor/api";
import type { Filiere } from "../types/filiereType";

export const filiereService = {
    getAll: async () => {
        const response = await axiosInstance.get('/filiere/all');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await axiosInstance.get(`/filiere/${id}`);
        return response.data;
    },

    create: async (data: Partial<Filiere>) => {
        const response = await axiosInstance.post('/filiere/create', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Filiere>) => {
        const response = await axiosInstance.patch(`/filiere/update/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/filiere/delete/${id}`);
        return response.data;
    }
};