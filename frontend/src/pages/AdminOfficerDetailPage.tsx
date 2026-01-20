import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../services/admin.service";

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
  };
}

const AdminOfficerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [officer, setOfficer] = useState<OfficerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await adminService.getOfficerById(id);
        setOfficer(data);
      } catch (error) {
        console.error("Failed to fetch officer details", error);
        alert("Không thể tải thông tin chi tiết");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

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
        { label: "Chức vụ", value: officer.profile?.unionPosition },
        { label: "Phòng ban", value: officer.profile?.department },
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
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

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/admin/officers")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:transform active:scale-95"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOfficerDetailPage;
