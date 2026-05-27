import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
    IsDateString,
} from 'class-validator';
import { Gender } from '../enums/gender';

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty({ message: 'Full name is required' })
    @Length(1, 100)
    full_name!: string;

    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;

    @IsString()
    @Length(8, 100, { message: 'Password must be at least 8 characters' })
    password!: string;

    @IsOptional()
    @IsString()
    @Length(9, 12, { message: 'ID number must be 9–12 characters' })
    identityNumber?: string;

    @IsOptional()
    @IsString()
    @Matches(/^(0|\+84)\d{9,10}$/, {
        message: 'Invalid phone number (must start with 0 or +84)',
    })
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'City cannot be blank' })
    city?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'District cannot be blank' })
    district?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Address cannot be blank' })
    address?: string;

    @IsOptional()
    @IsEnum(Gender, { message: 'Invalid gender' })
    gender?: Gender;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Date format must be yyyy-mm-dd' })
    dateOfBirth?: string;

    @IsString()
    @IsNotEmpty({ message: 'OTP code is required' })
    @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
    otp!: string;
}


export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    @Length(1, 100)
    full_name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email address' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(9, 12, { message: 'ID number must be 9–12 characters' })
    identityNumber?: string;

    @IsOptional()
    @IsString()
    @Matches(/^(0|\+84)\d{9,10}$/, {
        message: 'Invalid phone number (must start with 0 or +84)',
    })
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(Gender, { message: 'Invalid gender' })
    gender?: Gender;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Date format must be yyyy-mm-dd' })
    dateOfBirth?: string;
}


export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty({ message: 'Current password is required' })
    currentPassword!: string;

    @IsString()
    @Length(8, 100, { message: 'New password must be at least 8 characters' })
    newPassword!: string;
}
