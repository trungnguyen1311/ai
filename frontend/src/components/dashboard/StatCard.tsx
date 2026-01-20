import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "blue" | "emerald" | "amber" | "rose" | "indigo";
}

const colorClasses = {
  blue: "from-blue-500 to-blue-600 shadow-blue-500/20",
  emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20",
  amber: "from-amber-500 to-amber-600 shadow-amber-500/20",
  rose: "from-rose-500 to-rose-600 shadow-rose-500/20",
  indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/20",
};

const iconBgClasses = {
  blue: "bg-blue-400/20",
  emerald: "bg-emerald-400/20",
  amber: "bg-amber-400/20",
  rose: "bg-rose-400/20",
  indigo: "bg-indigo-400/20",
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} p-6 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group`}
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${iconBgClasses[color]} backdrop-blur-md rounded-2xl flex items-center justify-center text-white`}
          >
            {icon}
          </div>
          {trend && (
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white">
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-white text-3xl font-black tabular-nums tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
