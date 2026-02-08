export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    estado: number;
    email_verified_at?: string | null;
    must_change_password?: boolean | number; // API returns 0/1 but might be coerced
    created_at?: string;
    updated_at?: string;
    role?: any; // To be typed properly in models.ts or here
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    message?: string;
    user?: User;
    access_token?: string;
}
