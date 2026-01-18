export type Gender = 'Male' | 'Female' | 'Other';

export interface OfficerProfile {
    id: string;
    userId: string;
    employeeId: string;
    fullName: string;
    dateOfBirth?: string;
    gender: Gender;
    nationalId?: string;
    phoneNumber?: string;
    personalEmail?: string;
    address?: string;
    unionPosition: string;
    department: string;
    joinDate: string;
    isPartyMember: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileDto {
    phoneNumber?: string;
    personalEmail?: string;
    address?: string;
}

export interface CreateProfileDto {
    employeeId: string;
    fullName: string;
    unionPosition: string;
    department: string;
    dateOfBirth?: string;
    gender?: Gender;
    isPartyMember?: boolean;
}
