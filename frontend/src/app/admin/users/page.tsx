"use client";

import { useState, useMemo, ChangeEvent } from "react";
import {
  Users,
  Ban,
  CheckCircle,
  Mail,
  Trash2,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Input } from "@/component/Input-icon/Input";
import SelectSearch from "@/component/select/SelectSearch";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";

type UserRole = "user" | "admin" | "moderator";
type UserStatus = "active" | "suspended" | "pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  totalTransactions: number;
  totalVolume: number;
  lastActive: string;
  verified: boolean;
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinedDate: "2024-01-15",
    totalTransactions: 45,
    totalVolume: 125000,
    lastActive: "2025-10-24",
    verified: true,
  },
  {
    id: "USR-002",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "user",
    status: "active",
    joinedDate: "2024-02-20",
    totalTransactions: 32,
    totalVolume: 89000,
    lastActive: "2025-10-23",
    verified: true,
  },
  {
    id: "USR-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "user",
    status: "suspended",
    joinedDate: "2024-03-10",
    totalTransactions: 12,
    totalVolume: 15000,
    lastActive: "2025-10-20",
    verified: false,
  },
  {
    id: "USR-004",
    name: "Emily Brown",
    email: "emily@example.com",
    role: "moderator",
    status: "active",
    joinedDate: "2024-01-05",
    totalTransactions: 78,
    totalVolume: 234000,
    lastActive: "2025-10-24",
    verified: true,
  },
  {
    id: "USR-005",
    name: "David Lee",
    email: "david@example.com",
    role: "user",
    status: "pending",
    joinedDate: "2025-10-23",
    totalTransactions: 0,
    totalVolume: 0,
    lastActive: "2025-10-23",
    verified: false,
  },
  {
    id: "USR-006",
    name: "Lisa Wang",
    email: "lisa@example.com",
    role: "admin",
    status: "active",
    joinedDate: "2024-01-01",
    totalTransactions: 156,
    totalVolume: 450000,
    lastActive: "2025-10-24",
    verified: true,
  },
];

export default function UserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showActions, setShowActions] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const res = users.filter((user) => {
      const matchesSearch =
        q === "" ||
        user.name.toLowerCase().includes(q.toLowerCase()) ||
        user.email.toLowerCase().includes(q.toLowerCase()) ||
        user.id.toLowerCase().includes(q.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
    setPage(1);
    return res;
  }, [users, q, roleFilter, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filtered.slice(startIdx, endIdx);

  const getStatusColor = (status: UserStatus) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : status === "suspended"
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";
  };

  const getRoleColor = (role: UserRole) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-700"
      : role === "moderator"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2B0850]">
              User Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-[#2B0850]">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#2B0850] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Suspended</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.suspended}
                </p>
              </div>
              <Ban className="w-8 h-8 text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </p>
              </div>
              <Mail className="w-8 h-8 text-amber-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={q}
            icon="search"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQ(e.target.value)
            }
            placeholder="Search by name, email, or ID…"
            className="w-full outline-none text-sm"
          />

          <SelectSearch
            options={[
              { label: "All Roles", value: "all" },
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
              { label: "Moderator", value: "moderator" },
            ]}
            value={roleFilter}
            onChange={(v: string) => setRoleFilter(v)}
            placeholder="Filter by role"
          />

          <SelectSearch
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Suspended", value: "suspended" },
              { label: "Pending", value: "pending" },
            ]}
            value={statusFilter}
            onChange={(v: string) => setStatusFilter(v)}
            placeholder="Filter by status"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-left text-gray-600">
                  <Th>User</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last Active</Th>
                  <Th className="text-right pr-6">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50/70 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B0850] to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-[#2B0850]">
                            {user.name}
                          </span>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-gray-600">{user.email}</Td>
                    <Td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </Td>

                    <Td className="text-gray-600">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </Td>
                    <Td className="text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setShowActions(
                              showActions === user.id ? null : user.id
                            )
                          }
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {showActions === user.id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View More
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Send Email
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-amber-600">
                              <Ban className="w-4 h-4" />
                              {user.status === "suspended"
                                ? "Activate"
                                : "Suspend"}
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-600">
                        <Users className="w-12 h-12 text-gray-300 mb-2" />
                        <div className="font-medium">No Users Found</div>
                        <div className="text-sm">
                          Try adjusting your filters or search query.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-white text-sm">
            <div className="text-gray-600 order-2 sm:order-1">
              Showing{" "}
              <span className="font-medium">
                {total === 0 ? 0 : startIdx + 1}–{endIdx}
              </span>{" "}
              of <span className="font-medium">{total}</span>
            </div>

            <div className="flex items-center gap-3 order-1 sm:order-2">
              <div className="flex items-center gap-2 border rounded-md px-3 py-1.5">
                <span className="text-xs text-gray-500">Rows</span>
                <select
                  value={pageSize}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="outline-none text-sm bg-transparent"
                >
                  {[5, 10, 20].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Prev
                </button>
                <span className="text-gray-600">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    currentPage === totalPages || total === 0
                      ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
