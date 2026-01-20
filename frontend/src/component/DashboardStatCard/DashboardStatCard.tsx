"use client";

import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changeText?: string;
  changeColor?: string;
  bgColor?: string;
}

export default function DashboardStatCard({
  title,
  value,
  icon,
  changeText,
  changeColor = "text-gray-600",
  bgColor = "bg-gray-100",
}: DashboardStatCardProps) {
  return (
    <div className="flex-1 min-w-[200px] bg-white rounded-xl p-4 border border-gray-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>{icon}</div>
        {changeText && (
          <span className={`text-sm font-medium ${changeColor}`}>
            {changeText}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
