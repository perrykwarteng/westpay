"use client";

import { JSX, useState } from "react";
import {
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import DashboardStatCard from "@/component/DashboardStatCard/DashboardStatCard";

type TransactionStatus = "completed" | "in_progress" | "pending" | "disputed";
type DisputePriority = "high" | "medium" | "low";

interface Transaction {
  id: string;
  buyer: string;
  seller: string;
  amount: number;
  status: TransactionStatus;
  date: string;
}

interface Dispute {
  id: string;
  transaction: string;
  reason: string;
  priority: DisputePriority;
  days: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
}

interface StatusDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CategoryData {
  category: string;
  amount: number;
}

interface UserGrowthData {
  month: string;
  users: number;
}
export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Mock data - replace with real API calls
  const stats = {
    totalVolume: 2847650,
    activeTransactions: 43,
    totalUsers: 1247,
    completedToday: 12,
    pendingDisputes: 3,
  };

  const recentTransactions: Transaction[] = [
    {
      id: "ESC-2401",
      buyer: "John Doe",
      seller: "TechCorp Inc",
      amount: 5000,
      status: "in_progress",
      date: "2025-10-24",
    },
    {
      id: "ESC-2402",
      buyer: "Sarah Smith",
      seller: "WebStudio",
      amount: 12500,
      status: "completed",
      date: "2025-10-24",
    },
    {
      id: "ESC-2403",
      buyer: "Mike Johnson",
      seller: "DesignHub",
      amount: 3200,
      status: "disputed",
      date: "2025-10-23",
    },
    {
      id: "ESC-2404",
      buyer: "Emily Brown",
      seller: "CodeLabs",
      amount: 8900,
      status: "pending",
      date: "2025-10-23",
    },
    {
      id: "ESC-2405",
      buyer: "David Lee",
      seller: "DataSys",
      amount: 15000,
      status: "in_progress",
      date: "2025-10-22",
    },
  ];

  const disputes: Dispute[] = [
    {
      id: "DIS-101",
      transaction: "ESC-2403",
      reason: "Service not delivered",
      priority: "high",
      days: 2,
    },
    {
      id: "DIS-102",
      transaction: "ESC-2398",
      reason: "Quality issues",
      priority: "medium",
      days: 5,
    },
    {
      id: "DIS-103",
      transaction: "ESC-2395",
      reason: "Payment dispute",
      priority: "low",
      days: 8,
    },
  ];

  // Chart data
  const revenueData: RevenueData[] = [
    { date: "Oct 18", revenue: 45000, transactions: 15 },
    { date: "Oct 19", revenue: 52000, transactions: 18 },
    { date: "Oct 20", revenue: 48000, transactions: 16 },
    { date: "Oct 21", revenue: 61000, transactions: 22 },
    { date: "Oct 22", revenue: 55000, transactions: 19 },
    { date: "Oct 23", revenue: 67000, transactions: 24 },
    { date: "Oct 24", revenue: 58000, transactions: 20 },
  ];

  const statusDistribution: StatusDistribution[] = [
    { name: "Completed", value: 156, color: "#2B0850" },
    { name: "In Progress", value: 43, color: "#4A1A7A" },
    { name: "Pending", value: 28, color: "#C084FC" },
    { name: "Disputed", value: 8, color: "#E879F9" },
  ];

  const categoryData: CategoryData[] = [
    { category: "Web Dev", amount: 125000 },
    { category: "Design", amount: 98000 },
    { category: "Marketing", amount: 87000 },
    { category: "Consulting", amount: 76000 },
    { category: "Software", amount: 112000 },
    { category: "Other", amount: 45000 },
  ];

  const userGrowthData: UserGrowthData[] = [
    { month: "Apr", users: 856 },
    { month: "May", users: 923 },
    { month: "Jun", users: 1001 },
    { month: "Jul", users: 1089 },
    { month: "Aug", users: 1156 },
    { month: "Sep", users: 1198 },
    { month: "Oct", users: 1247 },
  ];

  const getStatusColor = (status: TransactionStatus): string => {
    const colors: Record<TransactionStatus, string> = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      disputed: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status: TransactionStatus): JSX.Element => {
    const icons: Record<TransactionStatus, JSX.Element> = {
      completed: <CheckCircle className="w-4 h-4" />,
      in_progress: <Clock className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      disputed: <XCircle className="w-4 h-4" />,
    };
    return icons[status];
  };

  const getPriorityColor = (priority: DisputePriority): string => {
    const colors: Record<DisputePriority, string> = {
      high: "text-red-600 bg-red-50",
      medium: "text-orange-600 bg-orange-50",
      low: "text-blue-600 bg-blue-50",
    };
    return colors[priority];
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 w-full mb-8">
            <DashboardStatCard
              title="Total Volume"
              value={`$${stats.totalVolume.toLocaleString()}`}
              icon={
                <DollarSign className="w-6 h-6" style={{ color: "#4A1A7A" }} />
              }
              changeText="+12.5%"
              changeColor="text-green-600"
              bgColor="bg-[#2B0850]/10"
            />

            <DashboardStatCard
              title="Active Transactions"
              value={stats.activeTransactions}
              icon={
                <FileText className="w-6 h-6" style={{ color: "#2B0850" }} />
              }
              changeText="+8.2%"
              changeColor="text-green-600"
              bgColor="bg-[#4A1A7A]/10"
            />

            <DashboardStatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={<Users className="w-6 h-6" style={{ color: "#2B0850" }} />}
              changeText="+15.3%"
              changeColor="text-green-600"
              bgColor="bg-[#4A1A7A]/10"
            />

            <DashboardStatCard
              title="Pending Disputes"
              value={stats.pendingDisputes}
              icon={
                <AlertCircle className="w-6 h-6" style={{ color: "#4A1A7A" }} />
              }
              changeText="Action Needed"
              changeColor="text-[#2B0850]"
              bgColor="bg-[#2B0850]/10"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue & Transactions Chart */}
            <div className="bg-white rounded-xl border border-gray-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Revenue & Transactions
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4A1A7A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4A1A7A" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2B0850"
                    strokeWidth={2.5}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Transaction Status Distribution */}
            <div className="bg-white rounded-xl border border-gray-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Transaction Status
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) =>
                      `${value}: ${entry?.payload?.value ?? 0}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-xl border border-gray-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Transaction Volume by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#6b7280"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#4A1A7A" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Growth */}
            <div className="bg-white rounded-xl border border-gray-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                User Growth
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#2B0850"
                    strokeWidth={3}
                    dot={{ fill: "#4A1A7A", r: 5 }}
                    activeDot={{ r: 7, fill: "#4A1A7A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-300">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Transactions
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parties
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-[#2B0850]">
                            {tx.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {tx.buyer}
                            </div>
                            <div className="text-gray-500">→ {tx.seller}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            ${tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              tx.status
                            )}`}
                          >
                            {getStatusIcon(tx.status)}
                            {tx.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disputes */}
            <div className="bg-white rounded-xl border border-gray-300">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Active Disputes
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {disputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#2B0850] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {dispute.id}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {dispute.transaction}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                          dispute.priority
                        )}`}
                      >
                        {dispute.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {dispute.reason}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {dispute.days} days old
                      </span>
                      <button className="text-xs text-[#2B0850] hover:text-[#380a6a] font-medium">
                        Review →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
