import type { User } from "./authType";

export interface RegisterData {
    email: string;
    password: string;
    immatriculation: string;
}

export interface RegisterResponse {
    user: User;
    token: string;
    refreshToken: string;
    message: string;
}