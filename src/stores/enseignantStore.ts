import { create } from "zustand";
import type { Enseignant } from "../types/enseignantType";
import { enseignantService } from "../services/enseignantService";

interface EnseignantState {
    enseignants: Enseignant[];
    selectedEnseignant: Enseignant | null;
    loading: boolean;
    error: string | null;

    setSelectedEnseignant: (enseignant: Enseignant | null) => void;
    getAll: () => Promise<void>;
    getOne: (id: number) => Promise<void>;
    createEnseignant: (data: Partial<Enseignant>) => Promise<void>;
    updateEnseignant: (id: number, data: Partial<Enseignant>) => Promise<void>;
    deleteEnseignant: (id: number) => Promise<void>;
}

export const useEnseignantStore = create<EnseignantState>((set, get) => ({
    enseignants: [],
    selectedEnseignant: null,
    loading: false,
    error: null,

    setSelectedEnseignant: (enseignant) =>
        set({ selectedEnseignant: enseignant, error: null }),

    getAll: async () => {
        set({ loading: true, error: null });
        try {
            const response = await enseignantService.getAll();
            set({ enseignants: response.data, loading: false });
        } catch (error) {
            console.error("Erreur récupération enseignants", error);
            set({ error: "Erreur lors du chargement des enseignants", loading: false });
        }
    },

    getOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const response = await enseignantService.getOne(id);
            set({ selectedEnseignant: response.data, loading: false });
        } catch (error) {
            console.error("Erreur récupération enseignant", error);
            set({ error: "Erreur lors du chargement de l'enseignant", loading: false });
        }
    },

    createEnseignant: async (data) => {
        set({ loading: true, error: null });
        try {
            await enseignantService.create(data);
            await get().getAll();
            set({ loading: false });
        } catch (error) {
            console.error("Erreur création enseignant", error);
            set({ error: "Erreur lors de la création de l'enseignant", loading: false });
            throw error;
        }
    },

    updateEnseignant: async (id, data) => {
        set({ loading: true, error: null });
        try {
            await enseignantService.update(id, data);
            await get().getAll();
            set({ selectedEnseignant: null, loading: false });
        } catch (error) {
            console.error("Erreur modification enseignant", error);
            set({ error: "Erreur lors de la modification de l'enseignant", loading: false });
            throw error;
        }
    },

    deleteEnseignant: async (id) => {
        set({ loading: true, error: null });
        try {
            await enseignantService.delete(id);
            set((state) => ({
                enseignants: state.enseignants.filter((ens) => ens.id !== id),
                loading: false,
            }));
        } catch (error) {
            console.error("Erreur suppression enseignant", error);
            set({ error: "Erreur lors de la suppression de l'enseignant", loading: false });
            throw error;
        }
    },
}));