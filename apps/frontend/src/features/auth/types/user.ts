export type UserRole = 'USER' | 'ADMIN'

export interface User {
    id: string;
    name: string;
    email: string;
    role?: UserRole
    avatar_url?: string;
}

