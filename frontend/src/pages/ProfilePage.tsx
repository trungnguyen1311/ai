import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
    id: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get<UserProfile>('/auth/me');
                setProfile(response.data);
            } catch (err: any) {
                console.error("Failed to fetch profile", err);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-400 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Profile</h1>
                        <button
                            onClick={logout}
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700 transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="border-b border-white/10 pb-6">
                            <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">User ID</label>
                            <p className="mt-2 text-lg text-white font-mono bg-black/20 p-3 rounded-lg border border-white/5 shadow-inner">{profile?.id}</p>
                        </div>
                        <div className="border-b border-white/10 pb-6">
                            <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                            <p className="mt-2 text-xl text-white font-medium">{profile?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">Role</label>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30 mt-2 shadow-sm">
                                {profile?.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
