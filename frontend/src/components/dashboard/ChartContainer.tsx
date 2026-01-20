import React from "react";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: string;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  height = "h-[350px]",
}: ChartContainerProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-500 text-sm font-medium mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`${height} w-full`}>{children}</div>
    </div>
  );
}
