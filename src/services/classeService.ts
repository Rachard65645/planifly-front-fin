import axiosInstance from "../interceptor/api";
import type { Salle } from "../types/salleType";

export const salleService = {

    getAll: async () => {
        const res = await axiosInstance.get("/salles/all");
        return res.data;
    },

    getOne: async (id: number) => {
        const res = await axiosInstance.get(`/salles/${id}`);
        return res.data;
    },

    create: async (data: Partial<Salle>) => {
        const res = await axiosInstance.post("/salles/create", data);
        return res.data;
    },

    update: async (
        id: number,
        data: Partial<Salle>
    ) => {
        const res = await axiosInstance.patch(
            `/salles/update/${id}`,
            data
        );

        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(
            `/salles/delete/${id}`
        );

        return res.data;
    },
};