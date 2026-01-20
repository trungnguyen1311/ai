import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useState } from "react";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      setError("");
      await api.post("/auth/register", data);
      setSuccess(true);
      // Don't auto-navigate, show verification message instead
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại với email khác.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-500/20">
            U
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Tạo tài khoản mới
        </h2>
        <p className="mt-3 text-center text-slate-400 font-medium">
          Bắt đầu hành trình quản lý công đoàn của bạn
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 py-10 px-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2.5rem] sm:px-12">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
              <p className="text-sm text-red-400 font-semibold text-center">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in slide-in-from-top-2">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-400 mb-2">
                  Đăng ký thành công!
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  Vui lòng kiểm tra email để xác thực tài khoản của bạn.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold rounded-xl transition-colors"
                >
                  Về trang đăng nhập
                </Link>
              </div>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"
              >
                Địa chỉ Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full bg-slate-900/50 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
                placeholder="name@company.com"
                {...register("email", { required: "Vui lòng nhập email" })}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                className={`w-full bg-slate-900/50 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
                placeholder="••••••••"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Tạo tài khoản"
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-500 font-medium">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
