import type { User } from "./authType";

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
    message: string;
}