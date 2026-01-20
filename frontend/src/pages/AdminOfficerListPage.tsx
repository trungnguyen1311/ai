import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../services/admin.service";
import {
  Department,
  UnionPosition,
  DepartmentLabels,
  UnionPositionLabels,
} from "../types/profile";
import type {
  Department as DeptType,
  UnionPosition as PosType,
  AdminCreateOfficerDto,
} from "../types/profile";
import { useForm } from "react-hook-form";

interface Officer {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  unionPosition: PosType;
  department: DeptType;
}

const AdminOfficerListPage: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    department: "" as DeptType | "",
    unionPosition: "" as PosType | "",
    isActive: "",
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<AdminCreateOfficerDto>();

  const fetchOfficers = useCallback(
    async (page = 1, currentFilters = filters) => {
      try {
        setLoading(true);
        const cleanParams = {
          page,
          limit: 10,
          search: currentFilters.search || undefined,
          department: currentFilters.department || undefined,
          unionPosition: currentFilters.unionPosition || undefined,
          isActive: currentFilters.isActive || undefined,
        };
        const res = await adminService.getOfficers(cleanParams);
        setOfficers(res.data);
        setMeta(res.meta);
      } catch (error) {
        console.error("Failed to fetch officers", error);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchOfficers();
  }, []);

  // Debounced search effect: searchInput -> filters.search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Automatically fetch when filters change
  useEffect(() => {
    fetchOfficers(1);
  }, [
    filters.search,
    filters.department,
    filters.unionPosition,
    filters.isActive,
    fetchOfficers,
  ]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchInput(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onCreateSubmit = async (data: AdminCreateOfficerDto) => {
    setIsSubmitting(true);
    try {
      await adminService.createOfficer(data);
      setIsModalOpen(false);
      reset();
      fetchOfficers(1);
      alert("Đã tạo cán bộ mới thành công!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Failed to create officer", error);
      alert(error.response?.data?.message || "Không thể tạo cán bộ mới");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await adminService.updateOfficerStatus(id, !currentStatus);
      setOfficers(
        officers.map((o) =>
          o.id === id ? { ...o, isActive: !currentStatus } : o,
        ),
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Quản lý Cán bộ
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Duyệt và quản lý thông tin tất cả cán bộ công đoàn trong hệ thống.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all duration-200"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm cán bộ mới
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="sm:col-span-1">
          <label
            htmlFor="search"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
          >
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Tên, mã, email..."
              value={searchInput}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="department"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
          >
            Phòng ban
          </label>
          <select
            name="department"
            id="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all duration-200"
          >
            <option value="">Tất cả phòng ban</option>
            {Object.values(Department).map((dept) => (
              <option key={dept} value={dept}>
                {DepartmentLabels[dept]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="unionPosition"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
          >
            Chức vụ
          </label>
          <select
            name="unionPosition"
            id="unionPosition"
            value={filters.unionPosition}
            onChange={handleFilterChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all duration-200"
          >
            <option value="">Tất cả chức vụ</option>
            {Object.values(UnionPosition).map((pos) => (
              <option key={pos} value={pos}>
                {UnionPositionLabels[pos]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="isActive"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
          >
            Trạng thái
          </label>
          <select
            name="isActive"
            id="isActive"
            value={filters.isActive}
            onChange={handleFilterChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all duration-200"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã bị chặn</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
            <p className="text-sm text-gray-500 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : officers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500 bg-gray-50/30">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-900">
              Không tìm thấy kết quả
            </p>
            <p className="text-sm">
              Hãy thử thay đổi tiêu chí tìm kiếm của bạn
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="py-4 pl-6 pr-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Cán bộ
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Phòng ban
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Chức vụ
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Trạng thái
                  </th>
                  <th className="py-4 pl-3 pr-6 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {officers.map((officer) => (
                  <tr
                    key={officer.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="whitespace-nowrap py-5 pl-6 pr-3">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {officer.fullName?.[0] ||
                              officer.email[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {officer.fullName || "Chưa cập nhật"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {officer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                        {officer.department
                          ? DepartmentLabels[officer.department]
                          : "N/A"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-600">
                      {officer.unionPosition
                        ? UnionPositionLabels[officer.unionPosition]
                        : "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(officer.id, officer.isActive)
                          }
                          className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                            officer.isActive ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                              officer.isActive
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-bold ${
                            officer.isActive
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {officer.isActive ? "Hoạt động" : "Bị chặn"}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-5 pl-3 pr-6 text-right text-sm">
                      <button
                        onClick={() =>
                          navigate(`/admin/officers/${officer.id}`)
                        }
                        className="inline-flex items-center px-3 py-1.5 border border-blue-100 text-xs font-bold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Trang <span className="text-gray-900">{meta.page}</span> /{" "}
                  {meta.totalPages} (Tổng {meta.total} kết quả)
                </p>
              </div>
              <nav className="flex items-center space-x-2">
                <button
                  disabled={meta.page === 1}
                  onClick={() => fetchOfficers(meta.page - 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {[...Array(meta.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show only current page, previous, and next if many pages
                  if (
                    pageNum === 1 ||
                    pageNum === meta.totalPages ||
                    Math.abs(pageNum - meta.page) <= 1
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchOfficers(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                          meta.page === pageNum
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (Math.abs(pageNum - meta.page) === 2) {
                    return (
                      <span key={pageNum} className="text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  disabled={meta.page === meta.totalPages}
                  onClick={() => fetchOfficers(meta.page + 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Create Officer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="bg-white px-8 pt-8 pb-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900">
                    Thêm cán bộ mới
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
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
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(onCreateSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Họ và tên *
                      </label>
                      <input
                        {...register("fullName", {
                          required: "Vui lòng nhập họ tên",
                        })}
                        className={`w-full bg-gray-50 border ${formErrors.fullName ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">
                          {formErrors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Email tài khoản *
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Vui lòng nhập email",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email không hợp lệ",
                          },
                        })}
                        className={`w-full bg-gray-50 border ${formErrors.email ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`}
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">
                          {formErrors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Mã nhân viên *
                      </label>
                      <input
                        {...register("employeeId", {
                          required: "Vui lòng nhập mã nhân viên",
                        })}
                        className={`w-full bg-gray-50 border ${formErrors.employeeId ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`}
                        placeholder="VD: CB1234"
                      />
                      {formErrors.employeeId && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">
                          {formErrors.employeeId.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Mật khẩu tạm thời *
                      </label>
                      <input
                        type="password"
                        {...register("password", {
                          required: "Vui lòng nhập mật khẩu",
                          minLength: {
                            value: 6,
                            message: "Tối thiểu 6 ký tự",
                          },
                        })}
                        className={`w-full bg-gray-50 border ${formErrors.password ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`}
                      />
                      {formErrors.password && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">
                          {formErrors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Phòng ban *
                      </label>
                      <select
                        {...register("department", {
                          required: "Vui lòng chọn phòng ban",
                        })}
                        className={`w-full bg-gray-50 border ${formErrors.department ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`}
                      >
                        <option value="">Chọn phòng ban</option>
                        {Object.values(Department).map((dept) => (
                          <option key={dept} value={dept}>
                            {DepartmentLabels[dept]}
                          </option>
                        ))}
                      </select>
                      {formErrors.department && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">
                          {formErrors.department.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Chức vụ *
                      </label>
                      <select
                        {...register("unionPosition", {
                          required: "Vui lòng chọn chức vụ",
                        })}
                        className={`w-full bg-gray-50 border ${formErrors.unionPosition ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`}
                      >
                        <option value="">Chọn chức vụ</option>
                        {Object.values(UnionPosition).map((pos) => (
                          <option key={pos} value={pos}>
                            {UnionPositionLabels[pos]}
                          </option>
                        ))}
                      </select>
                      {formErrors.unionPosition && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">
                          {formErrors.unionPosition.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Tạo tài khoản cán bộ"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOfficerListPage;
