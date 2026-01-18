import api from '../api/client';
import type { OfficerProfile, CreateProfileDto, UpdateProfileDto } from '../types/profile';

export const profileService = {
    getProfile: async (): Promise<OfficerProfile> => {
        const response = await api.get<OfficerProfile>('/api/v1/profile/me');
        return response.data;
    },

    createProfile: async (data: CreateProfileDto): Promise<OfficerProfile> => {
        const response = await api.post<OfficerProfile>('/api/v1/profile/me', data);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileDto): Promise<OfficerProfile> => {
        const response = await api.patch<OfficerProfile>('/api/v1/profile/me', data);
        return response.data;
    },
};
