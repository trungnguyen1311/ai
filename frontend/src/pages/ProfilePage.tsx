import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import type { OfficerProfile } from '../types/profile';
import { useForm } from 'react-hook-form';

export default function ProfilePage() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<OfficerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors: formErrors } } = useForm<any>();

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await profileService.getProfile();
            setProfile(data);
            reset(data);
            setIsCreating(false);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setIsCreating(true);
            } else {
                setError('Failed to load profile data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const onUpdateSubmit = async (data: any) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const updated = await profileService.updateProfile({
                phoneNumber: data.phoneNumber,
                personalEmail: data.personalEmail,
                address: data.address
            });
            setProfile(updated);
            setIsEditing(false);
            reset(updated);
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Update failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onCreateSubmit = async (data: any) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const created = await profileService.createProfile(data);
            setProfile(created);
            setIsCreating(false);
            reset(created);
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Creation failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
                <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white">
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-xl text-center">
                    <p className="text-xl font-medium text-red-400 mb-4">{error}</p>
                    <button onClick={fetchProfile} className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                            {profile?.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{profile?.fullName || 'New Officer'}</h1>
                            <p className="text-slate-400 font-medium">{profile?.unionPosition || 'Union Member'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300 font-semibold"
                    >
                        Sign Out
                    </button>
                </div>

                {isCreating ? (
                    <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Initialize Your Profile</h2>

                            {submitError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                                    {submitError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onCreateSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Employee ID</label>
                                    <input {...register('employeeId', { required: 'Employee ID is required' })} className={`w-full bg-slate-900/50 border ${formErrors.employeeId ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600`} placeholder="e.g. CB123" />
                                    {formErrors.employeeId && <p className="mt-1 text-xs text-red-400">{formErrors.employeeId.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Full Name</label>
                                    <input {...register('fullName', { required: 'Full name is required' })} className={`w-full bg-slate-900/50 border ${formErrors.fullName ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} />
                                    {formErrors.fullName && <p className="mt-1 text-xs text-red-400">{formErrors.fullName.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Union Position</label>
                                    <input {...register('unionPosition', { required: 'Union position is required' })} className={`w-full bg-slate-900/50 border ${formErrors.unionPosition ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600`} placeholder="e.g. Chairman" />
                                    {formErrors.unionPosition && <p className="mt-1 text-xs text-red-400">{formErrors.unionPosition.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Department</label>
                                    <input {...register('department', { required: 'Department is required' })} className={`w-full bg-slate-900/50 border ${formErrors.department ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} />
                                    {formErrors.department && <p className="mt-1 text-xs text-red-400">{formErrors.department.message as string}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : 'Create Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 shadow-2xl">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Official Status</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Employee ID</span>
                                        <span className="font-mono text-white bg-white/5 px-2 py-1 rounded">{profile?.employeeId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Department</span>
                                        <span className="text-white text-right font-medium">{profile?.department}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Party Member</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${profile?.isPartyMember ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {profile?.isPartyMember ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
                                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Contact & Personal</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Details'}
                                    </button>
                                </div>
                                <div className="p-8">
                                    {isEditing ? (
                                        <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
                                            {submitError && (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                                                    {submitError}
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-400 mb-2">Phone Number</label>
                                                <input {...register('phoneNumber', {
                                                    pattern: {
                                                        value: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                                                        message: 'Invalid Vietnamese phone number'
                                                    }
                                                })} className={`w-full bg-slate-900/50 border ${formErrors.phoneNumber ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50`} />
                                                {formErrors.phoneNumber && <p className="mt-1 text-xs text-red-400">{formErrors.phoneNumber.message as string}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-400 mb-2">Personal Email</label>
                                                <input {...register('personalEmail', {
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Invalid email address'
                                                    }
                                                })} className={`w-full bg-slate-900/50 border ${formErrors.personalEmail ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50`} />
                                                {formErrors.personalEmail && <p className="mt-1 text-xs text-red-400">{formErrors.personalEmail.message as string}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-400 mb-2">Residential Address</label>
                                                <textarea {...register('address')} rows={3} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                ) : 'Save Changes'}
                                            </button>
                                        </form>
                                    ) : (

                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-500 mb-1">Phone Number</p>
                                                    <p className="text-lg text-white">{profile?.phoneNumber || 'Not set'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-500 mb-1">Personal Email</p>
                                                    <p className="text-lg text-white">{profile?.personalEmail || 'Not set'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500 mb-1">Home Address</p>
                                                <p className="text-lg text-white leading-relaxed">{profile?.address || 'Not set'}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-500 mb-1">Gender</p>
                                                    <p className="text-white">{profile?.gender}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-500 mb-1">Joining Date</p>
                                                    <p className="text-white">{profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
