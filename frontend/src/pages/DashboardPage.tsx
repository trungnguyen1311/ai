import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profileService } from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import { DepartmentLabels, UnionPositionLabels } from "../types/profile";
import type { OfficerProfile } from "../types/profile";

export default function DashboardPage() {
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 404) {
        setError("Vui lòng hoàn thiện hồ sơ của bạn để tiếp tục.");
      } else {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-blue-500/10 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 rounded-3xl shadow-xl shadow-blue-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Xin chào, {profile?.fullName || "Công đoàn viên"}!
          </h1>
          <p className="text-xl text-blue-100 font-medium opacity-90 max-w-2xl">
            Chào mừng bạn quay trở lại với Hệ thống Quản lý Cán bộ Công đoàn.
            {user?.role === "ADMIN" && (
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-white/20 text-white border border-white/30 backdrop-blur-md uppercase tracking-wider">
                Quản trị viên
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Profile Summary */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-50">
            <div className="flex items-center space-x-3">
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
                Tóm tắt hồ sơ
              </h2>
            </div>
            <Link
              to="/profile"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all"
            >
              Xem chi tiết →
            </Link>
          </div>

          {error ? (
            <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-2xl text-yellow-700 text-sm font-bold flex items-center space-x-3">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="group p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Mã nhân viên
                </p>
                <p className="text-xl text-slate-900 font-bold">
                  {profile?.employeeId || "---"}
                </p>
              </div>
              <div className="group p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Chức vụ Công đoàn
                </p>
                <p className="text-xl text-slate-900 font-bold">
                  {profile?.unionPosition
                    ? UnionPositionLabels[profile.unionPosition]
                    : "---"}
                </p>
              </div>
              <div className="group p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Đơn vị / Phòng ban
                </p>
                <p className="text-xl text-slate-900 font-bold">
                  {profile?.department
                    ? DepartmentLabels[profile.department]
                    : "---"}
                </p>
              </div>
              <div className="group p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Ngày gia nhập
                </p>
                <p className="text-xl text-slate-900 font-bold">
                  {profile?.joinDate
                    ? new Date(profile.joinDate).toLocaleDateString("vi-VN")
                    : "---"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-6">
          {user?.role === "ADMIN" && (
            <Link
              to="/admin/officers"
              className="group bg-white border border-gray-100 hover:border-blue-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-900 font-black text-lg">
                  Quản lý Cán bộ
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  Hồ sơ và tài khoản
                </p>
              </div>
            </Link>
          )}

          <Link
            to="/profile"
            className="group bg-white border border-gray-100 hover:border-blue-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
              <svg
                className="w-7 h-7"
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
            <div>
              <h3 className="text-slate-900 font-black text-lg">
                Thông tin cá nhân
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                Xem chi tiết hồ sơ
              </p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="group bg-white border border-gray-100 hover:border-blue-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center space-x-5"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-slate-400 transition-colors group-hover:text-blue-600 group-hover:bg-blue-50 transition-transform group-hover:scale-110">
              <svg
                className="w-7 h-7"
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
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-lg">
                Cập nhật hồ sơ
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                Thay đổi thông tin
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
