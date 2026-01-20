import { useEffect, useState, useCallback } from "react";
import { profileService } from "../services/profileService";
import {
  Department,
  UnionPosition,
  DepartmentLabels,
  UnionPositionLabels,
} from "../types/profile";
import type {
  OfficerProfile,
  UpdateProfileDto,
  CreateProfileDto,
} from "../types/profile";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
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
      <div className="flex justify-center items-center min-h-[60vh] bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-50/50 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-4">
        <div className="max-w-md w-full p-10 bg-white border border-gray-100 rounded-3xl text-center shadow-xl">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
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
          <p className="text-2xl font-black text-slate-900 mb-3">
            Đã có lỗi xảy ra
          </p>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchProfile}
            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-black shadow-lg shadow-blue-500/20"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Profile Header Card */}
      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-all duration-700"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-500/20 border-4 border-white">
              {profile?.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {profile?.fullName || "Người dùng mới"}
              </h1>
              <div className="flex items-center mt-2 space-x-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 font-black uppercase text-[10px] tracking-widest rounded-lg border border-blue-100">
                  {profile?.unionPosition
                    ? UnionPositionLabels[profile.unionPosition]
                    : "Chưa cập nhật"}
                </span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-slate-500 font-bold text-sm uppercase tracking-wide">
                  {profile?.department
                    ? DepartmentLabels[profile.department]
                    : "Công đoàn viên"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing && profile) reset(profile);
              setIsEditing(!isEditing);
              setSubmitError(null);
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black transition-all ${
              isEditing
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            }`}
          >
            {isEditing ? (
              <>
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Hủy bỏ</span>
              </>
            ) : (
              <>
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Chỉnh sửa hồ sơ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isCreating ? (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-10">
            <div className="mb-10 text-center max-w-lg mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-3">
                Khởi tạo hồ sơ
              </h2>
              <p className="text-slate-500 font-medium">
                Vui lòng hoàn tất thông tin cơ bản để bắt đầu sử dụng hệ thống
                quản trị cán bộ công đoàn.
              </p>
            </div>

            {submitError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center space-x-3">
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
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Mã nhân viên *
                  </label>
                  <input
                    {...register("employeeId", {
                      required: "Vui lòng nhập mã nhân viên",
                    })}
                    className={`w-full bg-gray-50 border ${formErrors.employeeId ? "border-red-500" : "border-gray-200"} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold placeholder:font-medium`}
                    placeholder="VD: CB123456"
                  />
                  {formErrors.employeeId && (
                    <p className="text-xs text-red-500 mt-1 ml-1 font-bold">
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
                    className={`w-full bg-gray-50 border ${formErrors.fullName ? "border-red-500" : "border-gray-200"} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-500 mt-1 ml-1 font-bold">
                      {formErrors.fullName.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Chức vụ Công đoàn *
                  </label>
                  <select
                    {...register("unionPosition", {
                      required: "Vui lòng chọn chức vụ",
                    })}
                    className={`w-full bg-gray-50 border ${formErrors.unionPosition ? "border-red-500" : "border-gray-200"} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold group`}
                  >
                    <option value="">Chọn chức vụ</option>
                    {Object.values(UnionPosition).map((pos) => (
                      <option key={pos} value={pos}>
                        {UnionPositionLabels[pos]}
                      </option>
                    ))}
                  </select>
                  {formErrors.unionPosition && (
                    <p className="text-xs text-red-500 mt-1 ml-1 font-bold">
                      {formErrors.unionPosition.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    Đơn vị / Phòng ban *
                  </label>
                  <select
                    {...register("department", {
                      required: "Vui lòng chọn đơn vị",
                    })}
                    className={`w-full bg-gray-50 border ${formErrors.department ? "border-red-500" : "border-gray-200"} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold`}
                  >
                    <option value="">Chọn phòng ban</option>
                    {Object.values(Department).map((dept) => (
                      <option key={dept} value={dept}>
                        {DepartmentLabels[dept]}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="text-xs text-red-500 mt-1 ml-1 font-bold">
                      {formErrors.department.message as string}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Khởi tạo hồ sơ ngay"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Status Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-gray-50">
                Thông tin công tác
              </h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 font-bold">Mã nhân viên</span>
                  <span className="font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 font-bold text-sm">
                    {profile?.employeeId}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 font-bold">Đảng viên</span>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border transition-all ${
                      profile?.isPartyMember
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${profile?.isPartyMember ? "bg-red-500" : "bg-slate-400"}`}
                    ></span>
                    <span>{profile?.isPartyMember ? "ĐẢNG VIÊN" : "CHƯA"}</span>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3 text-slate-500 group">
                    <div className="mt-0.5 p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
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
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Ngày gia nhập Công đoàn
                      </p>
                      <p className="text-slate-900 font-bold">
                        {profile?.joinDate
                          ? new Date(profile.joinDate).toLocaleDateString(
                              "vi-VN",
                            )
                          : "---"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Detailed Info / Form */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden transition-all duration-500">
              <div className="px-10 py-6 border-b border-gray-50 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Thông tin cá nhân & Liên hệ
                </h2>
              </div>

              <div className="p-10">
                {isEditing ? (
                  <form
                    onSubmit={handleSubmit(onUpdateSubmit)}
                    className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    {submitError && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center space-x-3">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                          className={`w-full bg-gray-50 border ${formErrors.phoneNumber ? "border-red-500" : "border-gray-200"} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold`}
                        />
                        {formErrors.phoneNumber && (
                          <p className="text-xs text-red-500 mt-1 ml-1 font-bold">
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
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Địa chỉ email không hợp lệ",
                            },
                          })}
                          className={`w-full bg-gray-50 border ${formErrors.personalEmail ? "border-red-500" : "border-gray-200"} rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold`}
                        />
                        {formErrors.personalEmail && (
                          <p className="text-xs text-red-500 mt-1 ml-1 font-bold">
                            {formErrors.personalEmail.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                        Địa chỉ thường trú
                      </label>
                      <textarea
                        {...register("address")}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold resize-none"
                        placeholder="Nhập địa chỉ của bạn..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Lưu thay đổi hồ sơ"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>Số điện thoại</span>
                        </p>
                        <p className="text-xl text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                          {profile?.phoneNumber || "Chưa thiết lập"}
                        </p>
                      </div>
                      <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
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
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Email cá nhân</span>
                        </p>
                        <p className="text-xl text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                          {profile?.personalEmail || "Chưa thiết lập"}
                        </p>
                      </div>
                    </div>

                    <div className="group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
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
                      <p className="text-xl text-slate-900 font-bold leading-relaxed group-hover:text-blue-600 transition-colors">
                        {profile?.address || "Chưa thiết lập"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-gray-50">
                      <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Giới tính
                        </p>
                        <p className="text-lg text-slate-700 font-bold group-hover:text-blue-600 transition-colors uppercase tracking-wide">
                          {profile?.gender === "Male"
                            ? "Nam"
                            : profile?.gender === "Female"
                              ? "Nữ"
                              : profile?.gender || "---"}
                        </p>
                      </div>
                      <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                          Ngày sinh
                        </p>
                        <p className="text-lg text-slate-700 font-bold group-hover:text-blue-600 transition-colors uppercase tracking-wide">
                          {profile?.dateOfBirth
                            ? new Date(profile.dateOfBirth).toLocaleDateString(
                                "vi-VN",
                              )
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
  );
}
