import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../services/admin.service";
import {
  DepartmentLabels,
  UnionPositionLabels,
  OFFICER_TAGS,
} from "../types/profile";
import type { OfficerHistory } from "../types/profile";
import type { CV } from "../services/cvService"; // Using type import from another module or define it if not exported
import clsx from "clsx";

interface OfficerDetails {
  id: string;
  email: string;
  isActive: boolean;
  profile: {
    fullName: string;
    employeeId: string;
    dateOfBirth: string;
    gender: string;
    nationalId: string;
    phoneNumber: string;
    personalEmail: string;
    address: string;
    unionPosition: string;
    department: string;
    joinDate: string;
    isPartyMember: boolean;
    tags: string[];
  };
}

const AdminOfficerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [officer, setOfficer] = useState<OfficerDetails | null>(null);
  const [history, setHistory] = useState<OfficerHistory[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      const [officerData, historyData, cvData] = await Promise.all([
        adminService.getOfficerById(id),
        adminService.getOfficerHistory(id),
        adminService.getOfficerCVs(id),
      ]);
      setOfficer(officerData);
      setHistory(historyData);
      setCvs(cvData);
    } catch (error) {
      console.error("Failed to fetch officer details", error);
      alert("Không thể tải thông tin chi tiết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleTagToggle = async (tag: string) => {
    if (!officer || !id) return;
    const currentTags = officer.profile.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    try {
      // Optimistic update
      setOfficer({
        ...officer,
        profile: {
          ...officer.profile,
          tags: newTags,
        },
      });

      await adminService.updateOfficer(id, {
        tags: newTags,
      });
    } catch (error) {
      console.error("Failed to update tags", error);
      alert("Cập nhật tag thất bại");
      // Revert on failure
      setOfficer({
        ...officer,
        profile: {
          ...officer.profile,
          tags: currentTags,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">
          Không tìm thấy thông tin cán bộ.
        </p>
        <button
          onClick={() => navigate("/admin/officers")}
          className="mt-4 text-blue-600 font-semibold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const infoGroups = [
    {
      title: "Thông tin cơ bản",
      items: [
        { label: "Mã nhân viên", value: officer.profile?.employeeId },
        { label: "Họ và tên", value: officer.profile?.fullName },
        { label: "Ngày sinh", value: officer.profile?.dateOfBirth },
        { label: "Giới tính", value: officer.profile?.gender },
      ],
    },
    {
      title: "Liên lạc & Định danh",
      items: [
        { label: "CCCD/CMND", value: officer.profile?.nationalId },
        { label: "Số điện thoại", value: officer.profile?.phoneNumber },
        { label: "Email cá nhân", value: officer.profile?.personalEmail },
        { label: "Email hệ thống", value: officer.email },
        { label: "Địa chỉ", value: officer.profile?.address, span: true },
      ],
    },
    {
      title: "Công tác & Đảng đoàn",
      items: [
        {
          label: "Chức vụ",
          value:
            UnionPositionLabels[
              officer.profile?.unionPosition as keyof typeof UnionPositionLabels
            ] || officer.profile?.unionPosition,
        },
        {
          label: "Phòng ban",
          value:
            DepartmentLabels[
              officer.profile?.department as keyof typeof DepartmentLabels
            ] || officer.profile?.department,
        },
        { label: "Ngày gia nhập", value: officer.profile?.joinDate },
        {
          label: "Đảng viên",
          value: officer.profile?.isPartyMember ? "Có" : "Không",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/officers")}
              className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            >
              <svg
                className="h-6 w-6 text-gray-600"
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết Hồ sơ Cán bộ
              </h1>
              <p className="text-sm text-gray-500">
                Xem đầy đủ thông tin nhân sự trong hệ thống
              </p>
            </div>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${officer.isActive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
          >
            {officer.isActive ? "Trạng thái: Hoạt động" : "Trạng thái: Bị chặn"}
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-xl">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Phân loại cán bộ
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gán nhãn để quản lý và lọc hồ sơ dễ dàng hơn.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-wrap gap-3">
              {OFFICER_TAGS.map((tag) => {
                const isSelected = (officer.profile.tags || []).includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={clsx(
                      "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                      isSelected
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    <span
                      className={clsx(
                        "w-2 h-2 rounded-full mr-2",
                        isSelected ? "bg-blue-600" : "bg-gray-300",
                      )}
                    />
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Groups */}
        <div className="space-y-6">
          {infoGroups.map((group, idx) => (
            <div
              key={idx}
              className="bg-white shadow overflow-hidden sm:rounded-xl"
            >
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {group.title}
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6 text-sm text-gray-700">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  {group.items.map((item, i) => (
                    <div key={i} className={item.span ? "sm:col-span-2" : ""}>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-base text-gray-900 font-medium">
                        {item.value || "N/A"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>

        {/* CV Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-xl">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Hồ sơ CV
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Danh sách CV đã tải lên của cán bộ.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {cvs.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Chưa có CV nào.
              </p>
            ) : (
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${cv.isLatest ? "bg-indigo-50/50 border-indigo-100" : "bg-white border-gray-100"}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${cv.isLatest ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {cv.fileName}
                          </h4>
                          {cv.isLatest && (
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] uppercase font-bold rounded">
                              Mới nhất
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-500">
                          <span>Phiên bản {cv.version}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>
                            {(cv.fileSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>
                            {new Date(cv.uploadedAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        adminService.downloadOfficerCV(cv.id, cv.fileName)
                      }
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Tải xuống"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-xl">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lịch sử công tác
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Theo dõi quá trình thay đổi trạng thái và đơn vị công tác.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Chưa có dữ liệu lịch sử.
              </p>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {history.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== history.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={clsx(
                                "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                                event.changeType === "status"
                                  ? "bg-green-500"
                                  : "bg-blue-500",
                              )}
                            >
                              <svg
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {event.changeType === "status" ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                ) : (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                )}
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.changeType === "status"
                                  ? "Thay đổi trạng thái"
                                  : "Thay đổi đơn vị"}
                                <span className="font-medium text-gray-900 mx-1">
                                  {event.oldValue}
                                </span>
                                &rarr;
                                <span className="font-medium text-gray-900 mx-1">
                                  {event.newValue}
                                </span>
                              </p>
                              {event.note && (
                                <p className="text-xs text-gray-400 mt-0.5 italic">
                                  {event.note}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-500">
                              <time dateTime={event.changeDate}>
                                {new Date(event.changeDate).toLocaleString(
                                  "vi-VN",
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOfficerDetailPage;
