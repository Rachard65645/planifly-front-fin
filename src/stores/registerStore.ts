import { create } from 'zustand';
import { registerService } from '../services/registerService';

interface RegisterState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    register: (data: RegisterData) => Promise<boolean>;
    reset: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    immatriculation: string;
}

const useRegisterStore = create<RegisterState>((set) => ({
    isLoading: false,
    error: null,
    success: false,

    register: async (data: RegisterData) => {
        set({ isLoading: true, error: null, success: false });

        try {
            const response = await registerService.register(data);

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            set({
                isLoading: false,
                success: true,
                error: null
            });
            return true;

        } catch (error: any) {
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                "Erreur lors de l'inscription";
            set({
                error: errorMessage,
                isLoading: false,
                success: false
            });
            return false;
        }
    },

    reset: () => {
        set({ isLoading: false, error: null, success: false });
    },
}));

export default useRegisterStore;