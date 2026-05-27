export interface User {
    id: string;
    email: string;
    full_name: string;
    role?: 'USER' | 'ADMIN';
    password?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}