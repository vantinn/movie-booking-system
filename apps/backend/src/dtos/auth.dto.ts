import { IsEmail, isStrongPassword, Length } from 'class-validator';
import { UserRole } from '../enums/role';
export interface AuthDataResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        full_name: string;
        role: UserRole;
    } | null;

}


export interface AuthDataResponseRegister {
    accessToken: string;
    user: {
        id: string;
        email: string;
        full_name: string;
        role: UserRole;
    } | null;

}

export interface ServiceResult<T> {
    success: boolean
    message: string
    code?: string
    data?: T
}


export class LoginBody {
    @IsEmail()
    email!: string

    @Length(8, 100)
    password!: string

}


export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        full_name: string;
        role: UserRole;
    } | null;
}




