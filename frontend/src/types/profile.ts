export type Gender = "Male" | "Female" | "Other";

export const Department = {
  PROPAGANDA_EDUCATION: "PROPAGANDA_EDUCATION",
  ORGANIZATION: "ORGANIZATION",
  POLICIES_LAWS: "POLICIES_LAWS",
  OFFICE: "OFFICE",
  WOMEN_AFFAIRS: "WOMEN_AFFAIRS",
} as const;
export type Department = (typeof Department)[keyof typeof Department];

export const DepartmentLabels: Record<Department, string> = {
  [Department.PROPAGANDA_EDUCATION]: "Ban Tuyên giáo",
  [Department.ORGANIZATION]: "Ban Tổ chức",
  [Department.POLICIES_LAWS]: "Ban Chính sách pháp luật",
  [Department.OFFICE]: "Văn phòng",
  [Department.WOMEN_AFFAIRS]: "Ban Nữ công",
};

export const UnionPosition = {
  PRESIDENT: "PRESIDENT",
  VICE_PRESIDENT: "VICE_PRESIDENT",
  EXECUTIVE_COMMITTEE_MEMBER: "EXECUTIVE_COMMITTEE_MEMBER",
  BOARD_MEMBER: "BOARD_MEMBER",
  SPECIALIZED_OFFICER: "SPECIALIZED_OFFICER",
} as const;
export type UnionPosition = (typeof UnionPosition)[keyof typeof UnionPosition];

export const UnionPositionLabels: Record<UnionPosition, string> = {
  [UnionPosition.PRESIDENT]: "Chủ tịch",
  [UnionPosition.VICE_PRESIDENT]: "Phó Chủ tịch",
  [UnionPosition.EXECUTIVE_COMMITTEE_MEMBER]: "Ủy viên Ban Thường vụ",
  [UnionPosition.BOARD_MEMBER]: "Ủy viên Ban Chấp hành",
  [UnionPosition.SPECIALIZED_OFFICER]: "Cán bộ chuyên trách",
};

export const WorkStatus = {
  ACTIVE: "ACTIVE",
  TRANSFERRED: "TRANSFERRED",
  RETIRED: "RETIRED",
} as const;
export type WorkStatus = (typeof WorkStatus)[keyof typeof WorkStatus];

export const WorkStatusLabels: Record<WorkStatus, string> = {
  [WorkStatus.ACTIVE]: "Đang công tác",
  [WorkStatus.TRANSFERRED]: "Chuyển đơn vị",
  [WorkStatus.RETIRED]: "Nghỉ hưu / Nghỉ việc",
};

export interface OfficerProfile {
  id: string;
  userId: string;
  employeeId: string;
  fullName: string;
  dateOfBirth?: string;
  gender: Gender;
  nationalId?: string;
  phoneNumber?: string;
  personalEmail?: string;
  address?: string;
  unionPosition: UnionPosition;
  department: Department;
  joinDate: string;
  isPartyMember: boolean;
  unitName?: string;
  workStatus: WorkStatus;
  education?: string;
  experience?: string;
  skills?: string;
  achievements?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  phoneNumber?: string;
  personalEmail?: string;
  address?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationalId?: string;
  unitName?: string;
  unionPosition?: UnionPosition;
  workStatus?: WorkStatus;
  education?: string;
  experience?: string;
  skills?: string;
  achievements?: string;
  tags?: string[];
}

export interface CreateProfileDto {
  employeeId: string;
  fullName: string;
  unionPosition: UnionPosition;
  department: Department;
  dateOfBirth?: string;
  gender?: Gender;
  isPartyMember?: boolean;
  tags?: string[];
  unitName?: string;
  workStatus?: WorkStatus;
  education?: string;
  experience?: string;
  skills?: string;
  achievements?: string;
  phoneNumber?: string;
  personalEmail?: string;
  address?: string;
  nationalId?: string;
  joinDate?: string;
}

export interface AdminCreateOfficerDto extends CreateProfileDto {
  email: string;
  password: string;
}

export interface OfficerHistory {
  id: string;
  officerId: string;
  changeType: "unit" | "status";
  oldValue: string;
  newValue: string;
  note: string;
  changeDate: string;
}

export const OFFICER_TAGS = [
  "Cán bộ nguồn",
  "Chuẩn bị nghỉ hưu",
  "Cán bộ nữ",
  "Cán bộ trẻ",
];

export interface DashboardStats {
  officerStats: {
    total: number;
    byStatus: {
      active: number;
      inactive: number;
    };
    byDepartment: Array<{ type: Department; count: number }>;
    byPosition: Array<{ type: UnionPosition; count: number }>;
  };
  timeStats: {
    joinTrend: Array<{ label: string; count: number }>;
  };
  fundStats: {
    totalAmount: number;
    currency: string;
    byDepartment: Array<{ type: Department; amount: number }>;
    yearlyTrend: Array<{ year: number; amount: number }>;
  };
}
