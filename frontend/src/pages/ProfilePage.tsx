import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileService";
import type {
  OfficerProfile,
  UpdateProfileDto,
  CreateProfileDto,
} from "../types/profile";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<OfficerProfile>();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      reset(data);
      setIsCreating(false);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 404) {
        setIsCreating(true);
      } else {
        setError("Không thể tải dữ liệu hồ sơ. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onUpdateSubmit = async (data: UpdateProfileDto) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await profileService.updateProfile({
        phoneNumber: data.phoneNumber,
        personalEmail: data.personalEmail,
        address: data.address,
      });
      setProfile(updated);
      setIsEditing(false);
      reset(updated);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCreateSubmit = async (data: CreateProfileDto) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await profileService.createProfile(data);
      setProfile(created);
      setIsCreating(false);
      reset(created);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        error.response?.data?.message ||
          "Khởi tạo hồ sơ thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-blue-500/10 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white p-4">
        <div className="max-w-md w-full p-8 bg-red-500/5 border border-red-500/20 rounded-3xl backdrop-blur-2xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-xl font-bold text-white mb-2">Đã có lỗi xảy ra</p>
          <p className="text-slate-400 mb-8 whitespace-pre-wrap">{error}</p>
          <button
            onClick={fetchProfile}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl transition-all font-bold shadow-lg shadow-red-500/20"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/30 ring-4 ring-white/5">
              {profile?.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                {profile?.fullName || "Người dùng mới"}
              </h1>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-blue-400 font-bold uppercase text-xs tracking-widest">
                  {profile?.unionPosition || "Chưa cập nhật"}
                </span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="text-slate-400 font-medium">
                  {profile?.department || "Công đoàn viên"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 rounded-2xl transition-all duration-300 font-bold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Trang chủ</span>
            </Link>
            <button
              onClick={logout}
              className="group flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-2xl transition-all duration-300 font-bold"
            >
              <span>Đăng xuất</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        {isCreating ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-3xl overflow-hidden shadow-2xl">
            <div className="p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-white mb-2">
                  Khởi tạo hồ sơ cán bộ
                </h2>
                <p className="text-slate-400">
                  Vui lòng hoàn tất thông tin cơ bản để bắt đầu sử dụng hệ
                  thống.
                </p>
              </div>

              {submitError && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onCreateSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Mã nhân viên *
                  </label>
                  <input
                    {...register("employeeId", {
                      required: "Vui lòng nhập mã nhân viên",
                    })}
                    className={`w-full bg-slate-900/50 border ${formErrors.employeeId ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium`}
                    placeholder="VD: CB123456"
                  />
                  {formErrors.employeeId && (
                    <p className="text-xs text-red-400 mt-1 ml-1">
                      {formErrors.employeeId.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Họ và tên *
                  </label>
                  <input
                    {...register("fullName", {
                      required: "Vui lòng nhập họ tên",
                    })}
                    className={`w-full bg-slate-900/50 border ${formErrors.fullName ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-400 mt-1 ml-1">
                      {formErrors.fullName.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Chức vụ Công đoàn *
                  </label>
                  <input
                    {...register("unionPosition", {
                      required: "Vui lòng nhập chức vụ",
                    })}
                    className={`w-full bg-slate-900/50 border ${formErrors.unionPosition ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium`}
                    placeholder="VD: Chủ tịch Công đoàn"
                  />
                  {formErrors.unionPosition && (
                    <p className="text-xs text-red-400 mt-1 ml-1">
                      {formErrors.unionPosition.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Đơn vị / Phòng ban *
                  </label>
                  <input
                    {...register("department", {
                      required: "Vui lòng nhập đơn vị",
                    })}
                    className={`w-full bg-slate-900/50 border ${formErrors.department ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
                  />
                  {formErrors.department && (
                    <p className="text-xs text-red-400 mt-1 ml-1">
                      {formErrors.department.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Lưu hồ sơ"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Info */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-3xl p-8 shadow-2xl">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">
                  Trạng thái công tác
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-400 font-medium">
                      Mã nhân viên
                    </span>
                    <span className="font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 group-hover:scale-105 transition-transform">
                      {profile?.employeeId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-400 font-medium">Đơn vị</span>
                    <span className="text-white text-right font-bold group-hover:text-blue-400 transition-colors">
                      {profile?.department}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-400 font-medium">
                      Đảng viên
                    </span>
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border transition-all ${profile?.isPartyMember ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${profile?.isPartyMember ? "bg-red-500 animate-pulse" : "bg-slate-500"}`}
                      ></span>
                      <span>
                        {profile?.isPartyMember ? "ĐẢNG VIÊN" : "CHƯA"}
                      </span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-3 text-slate-500 text-xs font-medium">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Ngày gia nhập:{" "}
                        {profile?.joinDate
                          ? new Date(profile.joinDate).toLocaleDateString(
                              "vi-VN",
                            )
                          : "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-3xl shadow-2xl overflow-hidden transition-all duration-500">
                <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      Thông tin liên hệ & Cá nhân
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditing && profile) reset(profile);
                      setIsEditing(!isEditing);
                      setSubmitError(null);
                    }}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      isEditing
                        ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        : "bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-500/10"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Hủy bỏ</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        <span>Chỉnh sửa</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-10">
                  {isEditing ? (
                    <form
                      onSubmit={handleSubmit(onUpdateSubmit)}
                      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      {submitError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold flex items-center space-x-3">
                          <svg
                            className="w-5 h-5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{submitError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            Số điện thoại
                          </label>
                          <input
                            {...register("phoneNumber", {
                              pattern: {
                                value:
                                  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                                message: "Số điện thoại Việt Nam không hợp lệ",
                              },
                            })}
                            className={`w-full bg-slate-900/50 border ${formErrors.phoneNumber ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
                          />
                          {formErrors.phoneNumber && (
                            <p className="text-xs text-red-400 mt-1 ml-1">
                              {formErrors.phoneNumber.message as string}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            Email cá nhân
                          </label>
                          <input
                            {...register("personalEmail", {
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Địa chỉ email không hợp lệ",
                              },
                            })}
                            className={`w-full bg-slate-900/50 border ${formErrors.personalEmail ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
                          />
                          {formErrors.personalEmail && (
                            <p className="text-xs text-red-400 mt-1 ml-1">
                              {formErrors.personalEmail.message as string}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                          Địa chỉ thường trú
                        </label>
                        <textarea
                          {...register("address")}
                          rows={4}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          "Lưu thay đổi"
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-12 animate-in fade-in duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        <div className="group">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-slate-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>Số điện thoại</span>
                          </p>
                          <p className="text-xl text-white font-bold group-hover:text-blue-400 transition-colors">
                            {profile?.phoneNumber || "Chưa thiết lập"}
                          </p>
                        </div>
                        <div className="group">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-slate-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Email cá nhân</span>
                          </p>
                          <p className="text-xl text-white font-bold group-hover:text-blue-400 transition-colors">
                            {profile?.personalEmail || "Chưa thiết lập"}
                          </p>
                        </div>
                      </div>
                      <div className="group">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center space-x-2 text-left">
                          <svg
                            className="w-4 h-4 text-slate-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>Địa chỉ thường trú</span>
                        </p>
                        <p className="text-xl text-white font-bold leading-relaxed group-hover:text-blue-400 transition-colors text-left">
                          {profile?.address || "Chưa thiết lập"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5 text-left">
                        <div className="group">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                            Giới tính
                          </p>
                          <p className="text-lg text-slate-300 font-bold group-hover:text-blue-400 transition-colors">
                            {profile?.gender === "Male"
                              ? "Nam"
                              : profile?.gender === "Female"
                                ? "Nữ"
                                : profile?.gender || "---"}
                          </p>
                        </div>
                        <div className="group">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                            Ngày sinh
                          </p>
                          <p className="text-lg text-slate-300 font-bold group-hover:text-blue-400 transition-colors">
                            {profile?.dateOfBirth
                              ? new Date(
                                  profile.dateOfBirth,
                                ).toLocaleDateString("vi-VN")
                              : "---"}
                          </p>
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
