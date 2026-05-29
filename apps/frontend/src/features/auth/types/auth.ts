
export interface User {
    id: string;
    email: string;
    full_name: string;
    role?: 'USER' | 'ADMIN';
    password?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth?: string;
    phoneNumber?: string;
    identityNumber?: string;
    city?: string;
    district?: string;
    address?: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    full_name: string;
    email: string;
    password: string;
    otp: string;
    phoneNumber?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth?: string;
}

export interface SendOtpPayload {
    email: string;
    full_name?: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface AuthResponse {
    user: User | null;
    accessToken: string;
    refreshToken: string | null;
}


export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

