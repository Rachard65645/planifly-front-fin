
import { create } from "zustand";
import type { Filiere } from "../types/filiereType";
import { filiereService } from "../services/filiereService";

interface FiliereState {
    filieres: Filiere[];
    selectedFiliere: Filiere | null;
    loading: boolean;
    error: string | null;

    setSelectedFiliere: (filiere: Filiere | null) => void;
    getAll: () => Promise<void>;
    getOne: (id: number) => Promise<void>;
    createFiliere: (data: Partial<Filiere>) => Promise<void>;
    updateFiliere: (id: number, data: Partial<Filiere>) => Promise<void>;
    deleteFiliere: (id: number) => Promise<void>;
}

export const useFiliereStore = create<FiliereState>((set, get) => ({
    filieres: [],
    selectedFiliere: null,
    loading: false,
    error: null,

    setSelectedFiliere: (filiere) =>
        set({ selectedFiliere: filiere, error: null }),

    getAll: async () => {
        set({ loading: true, error: null });
        try {
            const response = await filiereService.getAll();
            set({ filieres: response.data, loading: false });
        } catch (error) {
            console.error("Erreur récupération filières", error);
            set({ error: "Erreur lors du chargement des filières", loading: false });
        }
    },

    getOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const response = await filiereService.getOne(id);
            set({ selectedFiliere: response.data, loading: false });
        } catch (error) {
            console.error("Erreur récupération filière", error);
            set({ error: "Erreur lors du chargement de la filière", loading: false });
        }
    },

    createFiliere: async (data) => {
        set({ loading: true, error: null });
        try {
            await filiereService.create(data);
            await get().getAll();
            set({ loading: false });
        } catch (error) {
            console.error("Erreur création filière", error);
            set({ error: "Erreur lors de la création de la filière", loading: false });
            throw error;
        }
    },

    updateFiliere: async (id, data) => {
        set({ loading: true, error: null });
        try {
            await filiereService.update(id, data);
            await get().getAll();
            set({ selectedFiliere: null, loading: false });
        } catch (error) {
            console.error("Erreur modification filière", error);
            set({ error: "Erreur lors de la modification de la filière", loading: false });
            throw error;
        }
    },

    deleteFiliere: async (id) => {
        set({ loading: true, error: null });
        try {
            await filiereService.delete(id);
            set((state) => ({
                filieres: state.filieres.filter((filiere) => filiere.id !== id),
                loading: false,
            }));
        } catch (error) {
            console.error("Erreur suppression filière", error);
            set({ error: "Erreur lors de la suppression de la filière", loading: false });
            throw error;
        }
    },
}));