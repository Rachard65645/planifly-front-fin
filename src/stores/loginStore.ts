import { create } from 'zustand';
import type { LoginData } from '../types/login';

interface LoginState {
    user: any;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: LoginData) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (data: LoginData) => {
        set({ isLoading: true, error: null });

        try {
            const { loginService } = await import('../services/loginService');
            const response = await loginService.login(data);

            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);

            set({
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            return true;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Erreur de connexion";
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null
        });
    },

    clearError: () => {
        set({ error: null });
    },
}));

export default useLoginStore;