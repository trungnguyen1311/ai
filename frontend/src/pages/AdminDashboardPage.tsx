import { useEffect, useState } from "react";
import { Users, Briefcase, DollarSign, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import adminService from "../services/admin.service";
import StatCard from "../components/dashboard/StatCard";
import ChartContainer from "../components/dashboard/ChartContainer";
import { DepartmentLabels, UnionPositionLabels } from "../types/profile";
import type { DashboardStats } from "../types/profile";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-bold animate-pulse text-lg">
          Đang tổng hợp dữ liệu...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-3xl text-rose-500 mb-6">
          <Activity size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Đã có lỗi xảy ra
        </h2>
        <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  // Prepare data for charts
  const deptData = stats.officerStats.byDepartment.map((d) => ({
    name: DepartmentLabels[d.type] || d.type,
    value: d.count,
  }));

  const posData = stats.officerStats.byPosition.map((p) => ({
    name: UnionPositionLabels[p.type] || p.type,
    count: p.count,
  }));

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Báo cáo & Thống kê
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Tổng quan tình hình cán bộ và nguồn thu công đoàn.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
            7 ngày
          </button>
          <button className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
            30 ngày
          </button>
          <button className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm transition-all focus:outline-none">
            Tất cả
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng cán bộ"
          value={stats.officerStats.total}
          icon={<Users size={24} />}
          trend={{ value: 12, isPositive: true }}
          color="indigo"
        />
        <StatCard
          title="Đang hoạt động"
          value={stats.officerStats.byStatus.active}
          icon={<Activity size={24} />}
          trend={{ value: 5, isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Chức vụ lãnh đạo"
          value={
            stats.officerStats.byPosition.find((p) => p.type === "PRESIDENT")
              ?.count || 0
          }
          icon={<Briefcase size={24} />}
          color="amber"
        />
        <StatCard
          title="Tổng quỹ (VND)"
          value={(stats.fundStats.totalAmount / 1000000).toFixed(1) + "M"}
          icon={<DollarSign size={24} />}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer
          title="Cơ cấu theo Ban / Phòng"
          subtitle="Phân bổ số lượng cán bộ trên từng đơn vị."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {deptData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Phổ biến Chức vụ"
          subtitle="Thống kê chức danh công đoàn hiện diện."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={posData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12, fontWeight: 600, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[0, 8, 8, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 gap-8">
        <ChartContainer
          title="Xu hướng gia nhập"
          subtitle="Số lượng cán bộ mới đăng ký qua từng tháng."
          height="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.timeStats.joinTrend}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fontWeight: 500, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fontWeight: 500, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Kinh phí theo đơn vị"
          subtitle="Nguồn quỹ công đoàn phân bổ cho các ban ngành."
          height="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.fundStats.byDepartment.map((f) => ({
                name: DepartmentLabels[f.type] || f.type,
                amount: f.amount,
              }))}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 500, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontWeight: 500, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val / 1000000).toFixed(0) + "M"}
              />
              <Tooltip
                formatter={(val: number | undefined) =>
                  val !== undefined
                    ? new Intl.NumberFormat("vi-VN").format(val) + " VND"
                    : ""
                }
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
