import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../services/admin.service";

interface Officer {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  unionPosition: string;
  department: string;
}

const AdminOfficerListPage: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    unionPosition: "",
    isActive: "",
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const navigate = useNavigate();

  const fetchOfficers = useCallback(
    async (page = 1, currentFilters = filters) => {
      try {
        setLoading(true);
        const res = await adminService.getOfficers({
          page,
          limit: 10,
          ...currentFilters,
        });
        setOfficers(res.data);
        setMeta(res.meta);
      } catch (error) {
        console.error("Failed to fetch officers", error);
        alert("Không thể tải danh sách cán bộ");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOfficers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search, fetchOfficers]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (name !== "search") {
      fetchOfficers(1, newFilters);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý Cán bộ Công đoàn
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Danh sách toàn bộ cán bộ và quản lý trạng thái tài khoản.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4 bg-white p-4 rounded-lg shadow ring-1 ring-black ring-opacity-5">
          <div className="col-span-1 sm:col-span-1">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Tìm kiếm
            </label>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Tên, mã, email..."
              value={filters.search}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Phòng ban
            </label>
            <select
              name="department"
              id="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tất cả phòng ban</option>
              <option value="Ban Tuyên giáo">Ban Tuyên giáo</option>
              <option value="Ban Tổ chức">Ban Tổ chức</option>
              <option value="Ban Chính sách pháp luật">
                Ban Chính sách pháp luật
              </option>
              <option value="Văn phòng">Văn phòng</option>
              <option value="Ban Nữ công">Ban Nữ công</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="unionPosition"
              className="block text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Chức vụ
            </label>
            <select
              name="unionPosition"
              id="unionPosition"
              value={filters.unionPosition}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tất cả chức vụ</option>
              <option value="Chủ tịch">Chủ tịch</option>
              <option value="Phó Chủ tịch">Phó Chủ tịch</option>
              <option value="Ủy viên Ban Thường vụ">
                Ủy viên Ban Thường vụ
              </option>
              <option value="Ủy viên Ban Chấp hành">
                Ủy viên Ban Chấp hành
              </option>
              <option value="Cán bộ chuyên trách">Cán bộ chuyên trách</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="isActive"
              className="block text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Trạng thái
            </label>
            <select
              name="isActive"
              id="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã bị chặn</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : officers.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                    <svg
                      className="h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      Không tìm thấy cán bộ nào
                    </p>
                    <p className="text-sm">
                      Hãy thử thay đổi tiêu chí tìm kiếm
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Họ tên
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Chức vụ / Phòng ban
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Trạng thái
                        </th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                          <span className="sr-only">Hành động</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {officers.map((officer) => (
                        <tr
                          key={officer.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                  {officer.fullName?.[0] ||
                                    officer.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {officer.fullName || "Chưa cập nhật"}
                                </div>
                                <div className="text-gray-500">
                                  {officer.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">
                              {officer.unionPosition || "N/A"}
                            </div>
                            <div className="text-gray-500">
                              {officer.department || "N/A"}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <button
                              onClick={() =>
                                handleToggleStatus(officer.id, officer.isActive)
                              }
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${officer.isActive ? "bg-emerald-500" : "bg-gray-200"}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${officer.isActive ? "translate-x-5" : "translate-x-0"}`}
                              />
                            </button>
                            <span
                              className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${officer.isActive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                            >
                              {officer.isActive ? "Hoạt động" : "Bị chặn"}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() =>
                                navigate(`/admin/officers/${officer.id}`)
                              }
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Pagination */}
                {!loading && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        disabled={meta.page === 1}
                        onClick={() => fetchOfficers(meta.page - 1)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      <button
                        disabled={meta.page === meta.totalPages}
                        onClick={() => fetchOfficers(meta.page + 1)}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Hiển thị{" "}
                          <span className="font-medium">
                            {(meta.page - 1) * meta.limit + 1}
                          </span>{" "}
                          tới{" "}
                          <span className="font-medium">
                            {Math.min(meta.page * meta.limit, meta.total)}
                          </span>{" "}
                          trong{" "}
                          <span className="font-medium">{meta.total}</span> kết
                          quả
                        </p>
                      </div>
                      <div>
                        <nav
                          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                          aria-label="Pagination"
                        >
                          {[...Array(meta.totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => fetchOfficers(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${meta.page === i + 1 ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOfficerListPage;
