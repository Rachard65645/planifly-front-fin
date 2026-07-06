import { create } from "zustand";
import type { Cours } from "../types/coursType";
import type { Semestre } from "../types/semestreType";
import { coursService } from "../services/coursService";
import { semestreService } from "../services/semestreService";

interface CoursState {
    cours: Cours[];
    semestres: Semestre[];
    selectedCours: Cours | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;

    setSelectedCours: (cours: Cours | null) => void;
    clearMessages: () => void;
    getAll: () => Promise<void>;
    getAllSemestres: () => Promise<void>;
    getOne: (id: number) => Promise<void>;
    createCours: (data: Partial<Cours>) => Promise<boolean>;
    updateCours: (id: number, data: Partial<Cours>) => Promise<boolean>;
    deleteCours: (id: number) => Promise<boolean>;
    getCoursByFiliere: (filiereId: number) => Cours[];
    getCoursByEnseignant: (enseignantId: number) => Cours[];
    getCoursBySemestre: (semestreId: number) => Cours[];
}

export const useCoursStore = create<CoursState>((set, get) => ({
    cours: [],
    semestres: [],
    selectedCours: null,
    loading: false,
    error: null,
    successMessage: null,

    setSelectedCours: (cours) =>
        set({ selectedCours: cours, error: null, successMessage: null }),

    clearMessages: () =>
        set({ error: null, successMessage: null }),

    getAll: async () => {
        set({ loading: true, error: null });
        try {
            const coursData = await coursService.getAll();
            
            set({ cours: coursData, loading: false });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || "Erreur lors du chargement des cours",
                loading: false
            });
        }
    },

    getAllSemestres: async () => {
        try {
            const semestresData = await semestreService.getAll();
            set({ semestres: semestresData });
        } catch (error) {
            console.error("Erreur récupération semestres", error);
        }
    },

    getOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const coursData = await coursService.getOne(id);
            set({ selectedCours: coursData, loading: false });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || "Erreur lors du chargement du cours",
                loading: false
            });
        }
    },

    createCours: async (data) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await coursService.create(data);
            if (response.success) {
                await get().getAll();
                set({
                    loading: false,
                    successMessage: response.message || "Cours créé avec succès"
                });
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la création du cours",
                loading: false
            });
            return false;
        }
    },

    updateCours: async (id, data) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await coursService.update(id, data);
            if (response.success) {
                await get().getAll();
                set({
                    selectedCours: null,
                    loading: false,
                    successMessage: response.message || "Cours modifié avec succès"
                });
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la modification du cours",
                loading: false
            });
            return false;
        }
    },

    deleteCours: async (id) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const response = await coursService.delete(id);
            if (response.success) {
                set((state) => ({
                    cours: state.cours.filter((c) => c.id !== id),
                    loading: false,
                    successMessage: response.message || "Cours supprimé avec succès"
                }));
                setTimeout(() => set({ successMessage: null }), 3000);
                return true;
            }
            throw new Error(response.message);
        } catch (error: any) {
            set({
                error: error?.response?.data?.message || error?.message || "Erreur lors de la suppression du cours",
                loading: false
            });
            return false;
        }
    },

    getCoursByFiliere: (filiereId: number) => {
        return get().cours.filter(c => c.filiere_id === filiereId);
    },

    getCoursByEnseignant: (enseignantId: number) => {
        return get().cours.filter(c => c.enseignant_id === enseignantId);
    },

    getCoursBySemestre: (semestreId: number) => {
        return get().cours.filter(c => c.semestre_id === semestreId);
    }
}));