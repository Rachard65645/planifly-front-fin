import { create } from "zustand";
import type { Salle } from "../types/salleType";
import { salleService } from "../services/classeService";

interface SalleState {
  salles: Salle[];
  selectedSalle: Salle | null;
  loading: boolean;

  setSelectedSalle: (
    salle: Salle | null
  ) => void;

  getAll: () => Promise<void>;

  createSalle: (
    data: Partial<Salle>
  ) => Promise<void>;

  updateSalle: (
    id: number,
    data: Partial<Salle>
  ) => Promise<void>;

  deleteSalle: (
    id: number
  ) => Promise<void>;
}

export const useSalleStore =
  create<SalleState>((set, get) => ({
    salles: [],
    selectedSalle: null,
    loading: false,

    setSelectedSalle: (salle) =>
      set({
        selectedSalle: salle,
      }),

    getAll: async () => {
      set({ loading: true });

      try {
        const response =
          await salleService.getAll();

        set({
          salles: response.data,
        });
      } catch (error) {
        console.error(
          "Erreur récupération salles",
          error
        );
      } finally {
        set({ loading: false });
      }
    },

    createSalle: async (data) => {
      set({ loading: true });

      try {
        await salleService.create(data);

        await get().getAll();
      } catch (error) {
        console.error(
          "Erreur création salle",
          error
        );
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateSalle: async (
      id,
      data
    ) => {
      set({ loading: true });

      try {
        await salleService.update(
          id,
          data
        );

        await get().getAll();

        set({
          selectedSalle: null,
        });
      } catch (error) {
        console.error(
          "Erreur modification salle",
          error
        );
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteSalle: async (id) => {
      set({ loading: true });

      try {
        await salleService.delete(id);

        set((state) => ({
          salles: state.salles.filter(
            (salle) => salle.id !== id
          ),
        }));
      } catch (error) {
        console.error(
          "Erreur suppression salle",
          error
        );
        throw error;
      } finally {
        set({ loading: false });
      }
    },
  }));