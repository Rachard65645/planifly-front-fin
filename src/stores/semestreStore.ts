import { create } from "zustand";
import type { Semestre } from "../types/semestreType";
import { semestreService } from "../services/semestreService";

interface SemestreState {
    semestres: Semestre[];
    selectedSemestre: Semestre | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;

    setSelectedSemestre: (semestre: Semestre | null) => void;
    clearMessages: () => void;
    getAll: () => Promise<void>;
    getOne: (id: number) => Promise<void>;
    createSemestre: (data: { numero: number; anneeUniversitaire: string }) => Promise<boolean>;
    updateSemestre: (id: number, data: { numero: number; anneeUniversitaire: string }) => Promise<boolean>;
    deleteSemestre: (id: number) => Promise<boolean>;
    getSemestresByAnnee: (annee: string) => Semestre[];
    getSemestreDisplayName: (semestre: Semestre) => string;
}

export const useSemestreStore = create<SemestreState>((set, get) => ({
    semestres: [],
    selectedSemestre: null,
    loading: false,
    error: null,
    successMessage: null,

    setSelectedSemestre: (semestre) =>
        set({ selectedSemestre: semestre, error: null, successMessage: null }),

    clearMessages: () =>
        set({ error: null, successMessage: null }),

    getAll: async () => {
        set({ loading: true, error: null });
        try {
            const semestresData = await semestreService.getAll();
            set({ semestres: semestresData, loading: false });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || "Erreur lors du chargement des semestres",
                loading: false
            });
        }
    },

    getOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const semestreData = await semestreService.getOne(id);
            set({ selectedSemestre: semestreData, loading: false });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || "Erreur lors du chargement du semestre",
                loading: false
            });
        }
    },

    createSemestre: async (data) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await semestreService.create(data);
            if (response.success) {
                await get().getAll();
                set({
                    loading: false,
                    successMessage: response.message || "Semestre créé avec succès"
                });
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la création du semestre",
                loading: false
            });
            return false;
        }
    },

    updateSemestre: async (id, data) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await semestreService.update(id, data);
            if (response.success) {
                await get().getAll();
                set({
                    selectedSemestre: null,
                    loading: false,
                    successMessage: response.message || "Semestre modifié avec succès"
                });
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la modification du semestre",
                loading: false
            });
            return false;
        }
    },

    deleteSemestre: async (id) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await semestreService.delete(id);
            if (response.success) {
                set((state) => ({
                    semestres: state.semestres.filter((s) => s.id !== id),
                    loading: false,
                    successMessage: response.message || "Semestre supprimé avec succès"
                }));
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la suppression du semestre",
                loading: false
            });
            return false;
        }
    },

    getSemestresByAnnee: (annee: string) => {
        return get().semestres.filter(s => s.anneeUniversitaire === annee);
    },

    getSemestreDisplayName: (semestre: Semestre) => {
        return `Semestre ${semestre.numero} - ${semestre.anneeUniversitaire}`;
    }
}));