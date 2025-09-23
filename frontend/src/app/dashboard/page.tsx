"use client";

import DashboardLayout from "../../component/Dashboard/DashboardLayout";

const stats = [
  {
    title: "One",
    value: "$216k",
    change: "+20.1%",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    title: "Two",
    value: "2,221",
    change: "+10.2%",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Three",
    value: "1,423",
    change: "+5.6%",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Four",
    value: "78%",
    change: "+1.2%",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Johnson
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s an overview of your dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${stat.bgColor}`}></div>
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
