import { create } from "zustand";
import type { Emploi } from "../types/emploiType";
import { emploiService } from "../services/emploiService";

interface EmploiState {
    emplois: Emploi[];
    selectedEmploi: Emploi | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;

    setSelectedEmploi: (emploi: Emploi | null) => void;
    clearMessages: () => void;
    getAll: () => Promise<void>;
    getOne: (id: number) => Promise<void>;
    createEmploi: (data: Partial<Emploi>) => Promise<boolean>;
    updateEmploi: (id: number, data: Partial<Emploi>) => Promise<boolean>;
    deleteEmploi: (id: number) => Promise<boolean>;
    getEmploisByDate: (date: string) => Emploi[];
    getEmploisByEnseignant: (enseignantId: number) => Emploi[];
    getEmploisBySalle: (salleId: number) => Emploi[];
}

export const useEmploiStore = create<EmploiState>((set, get) => ({
    emplois: [],
    selectedEmploi: null,
    loading: false,
    error: null,
    successMessage: null,

    setSelectedEmploi: (emploi) =>
        set({ selectedEmploi: emploi, error: null, successMessage: null }),

    clearMessages: () =>
        set({ error: null, successMessage: null }),

    getAll: async () => {
        set({ loading: true, error: null });
        try {
            const emploisData = await emploiService.getAll();
            set({ emplois: emploisData, loading: false });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || "Erreur lors du chargement des plannings",
                loading: false
            });
        }
    },

    getOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const emploiData = await emploiService.getOne(id);
            set({ selectedEmploi: emploiData, loading: false });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || "Erreur lors du chargement du planning",
                loading: false
            });
        }
    },

    createEmploi: async (data) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await emploiService.create(data);
            if (response.success) {
                await get().getAll();
                set({
                    loading: false,
                    successMessage: response.message || "Planning créé avec succès"
                });
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la création du planning",
                loading: false
            });
            return false;
        }
    },

    updateEmploi: async (id, data) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await emploiService.update(id, data);
            if (response.success) {
                await get().getAll();
                set({
                    selectedEmploi: null,
                    loading: false,
                    successMessage: response.message || "Planning modifié avec succès"
                });
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la modification du planning",
                loading: false
            });
            return false;
        }
    },

    deleteEmploi: async (id) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await emploiService.delete(id);
            if (response.success) {
                set((state) => ({
                    emplois: state.emplois.filter((e) => e.id !== id),
                    loading: false,
                    successMessage: response.message || "Planning supprimé avec succès"
                }));
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la suppression du planning",
                loading: false
            });
            return false;
        }
    },

    getEmploisByDate: (date: string) => {
        return get().emplois.filter(e => e.dateCours === date);
    },

    getEmploisByEnseignant: (enseignantId: number) => {
        return get().emplois.filter(e => e.enseignant_id === enseignantId);
    },

    getEmploisBySalle: (salleId: number) => {
        return get().emplois.filter(e => e.salle_id === salleId);
    }
}));