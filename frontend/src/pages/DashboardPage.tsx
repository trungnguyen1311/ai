import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profileService } from "../services/profileService";
import type { OfficerProfile } from "../types/profile";

export default function DashboardPage() {
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-blue-500/10 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Greeting Section */}
        <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Xin chào,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {profile?.fullName || "Công đoàn viên"}!
              </span>
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              Chào mừng bạn quay trở lại với Hệ thống Quản lý Cán bộ Công đoàn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Profile Summary */}
          <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 backdrop-blur-3xl shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white">Tóm tắt hồ sơ</h2>
              <Link
                to="/profile"
                className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Xem chi tiết →
              </Link>
            </div>

            {error ? (
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-500 text-sm font-bold">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Mã nhân viên
                  </p>
                  <p className="text-lg text-white font-bold">
                    {profile?.employeeId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Chức vụ
                  </p>
                  <p className="text-lg text-white font-bold">
                    {profile?.unionPosition}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Đơn vị
                  </p>
                  <p className="text-lg text-white font-bold">
                    {profile?.department}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Ngày gia nhập
                  </p>
                  <p className="text-lg text-white font-bold">
                    {profile?.joinDate
                      ? new Date(profile.joinDate).toLocaleDateString("vi-VN")
                      : "---"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            <Link
              to="/profile"
              className="flex-1 group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-500/20 transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110">
                <svg
                  className="w-6 h-6"
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
                <h3 className="text-white font-black text-xl mb-1">
                  Hồ sơ cá nhân
                </h3>
                <p className="text-blue-100 text-sm font-medium opacity-80">
                  Xem thông tin chi tiết của bạn
                </p>
              </div>
            </Link>

            <Link
              to="/profile" // Link to profile page where edit is available
              className="flex-1 group bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[2rem] transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 mb-4 transition-transform group-hover:scale-110 group-hover:text-white">
                <svg
                  className="w-6 h-6"
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
                <h3 className="text-white font-black text-xl mb-1">
                  Cập nhật hồ sơ
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  Thay đổi thông tin liên hệ
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
