"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Input } from "@/component/Input-icon/Input";
import SelectSearch from "@/component/select/SelectSearch";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";

type TransactionStatus =
  | "completed"
  | "in_progress"
  | "pending"
  | "disputed"
  | "cancelled";

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  status: TransactionStatus;
  category: string;
  paymentMethod: string;
  date: string;
  completionDate?: string;
  buyerEmail: string;
  sellerEmail: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "ESC-2401",
    sender: "John Doe",
    receiver: "TechCorp Inc",
    amount: 5000,
    status: "in_progress",
    category: "Web Dev",
    paymentMethod: "Bank Transfer",
    date: "2025-10-24",
    buyerEmail: "john@example.com",
    sellerEmail: "tech@corp.com",
  },
  {
    id: "ESC-2402",
    sender: "Sarah Smith",
    receiver: "WebStudio",
    amount: 12500,
    status: "completed",
    category: "Design",
    paymentMethod: "Credit Card",
    date: "2025-10-24",
    completionDate: "2025-10-24",
    buyerEmail: "sarah@example.com",
    sellerEmail: "web@studio.com",
  },
  {
    id: "ESC-2403",
    sender: "Mike Johnson",
    receiver: "DesignHub",
    amount: 3200,
    status: "disputed",
    category: "Design",
    paymentMethod: "Momo",
    date: "2025-10-23",
    buyerEmail: "mike@example.com",
    sellerEmail: "design@hub.com",
  },
  {
    id: "ESC-2404",
    sender: "Emily Brown",
    receiver: "CodeLabs",
    amount: 8900,
    status: "pending",
    category: "Software",
    paymentMethod: "Credit Card",
    date: "2025-10-23",
    buyerEmail: "emily@example.com",
    sellerEmail: "code@labs.com",
  },
  {
    id: "ESC-2405",
    sender: "David Lee",
    receiver: "DataSys",
    amount: 15000,
    status: "in_progress",
    category: "Consulting",
    paymentMethod: "Bank Transfer",
    date: "2025-10-22",
    buyerEmail: "david@example.com",
    sellerEmail: "data@sys.com",
  },
  {
    id: "ESC-2406",
    sender: "Lisa Wang",
    receiver: "MarketPro",
    amount: 6700,
    status: "completed",
    category: "Marketing",
    paymentMethod: "Credit Card",
    date: "2025-10-21",
    completionDate: "2025-10-22",
    buyerEmail: "lisa@example.com",
    sellerEmail: "market@pro.com",
  },
  {
    id: "ESC-2407",
    sender: "Tom Harris",
    receiver: "DevTeam",
    amount: 9200,
    status: "cancelled",
    category: "Web Dev",
    paymentMethod: "Momo",
    date: "2025-10-20",
    buyerEmail: "tom@example.com",
    sellerEmail: "dev@team.com",
  },
];

export default function AllTransactions() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        q === "" ||
        transaction.id.toLowerCase().includes(q.toLowerCase()) ||
        transaction.sender.toLowerCase().includes(q.toLowerCase()) ||
        transaction.receiver.toLowerCase().includes(q.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [transactions, q, statusFilter, categoryFilter]);

  // ✅ Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [q, statusFilter, categoryFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filtered.slice(startIdx, endIdx);

  const getStatusColor = (status: TransactionStatus) => {
    return status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "in_progress"
      ? "bg-blue-100 text-blue-700"
      : status === "pending"
      ? "bg-amber-100 text-amber-700"
      : status === "disputed"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";
  };

  const exportData = () => {
    const csv = [
      [
        "ID",
        "Date",
        "Buyer",
        "Seller",
        "Amount",
        "Status",
        "Category",
        "Payment Method",
      ],
      ...filtered.map((t) => [
        t.id,
        t.date,
        t.sender,
        t.receiver,
        t.amount,
        t.status,
        t.category,
        t.paymentMethod,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    inProgress: transactions.filter((t) => t.status === "in_progress").length,
    disputed: transactions.filter((t) => t.status === "disputed").length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2B0850]">
              All Transactions
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all escrow transactions
            </p>
          </div>
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B0850] text-white rounded-md hover:bg-[#3c1070] transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} color="text-[#2B0850]" />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="text-green-600"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="text-blue-600"
          />
          <StatCard
            label="Disputed"
            value={stats.disputed}
            color="text-red-600"
          />
          <StatCard
            label="Total Volume"
            value={`$${stats.totalVolume.toLocaleString()}`}
            color="text-purple-600"
          />
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={q}
            icon="search"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQ(e.target.value)
            }
            placeholder="Search by ID, buyer, or seller…"
            className="w-full outline-none text-sm"
          />

          <SelectSearch
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Completed", value: "completed" },
              { label: "In Progress", value: "in_progress" },
              { label: "Pending", value: "pending" },
              { label: "Disputed", value: "disputed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            value={statusFilter}
            onChange={(v: string) => setStatusFilter(v)}
            placeholder="Filter by status"
          />

          <SelectSearch
            options={categories.map((cat) => ({
              label: cat === "all" ? "All Categories" : cat,
              value: cat,
            }))}
            value={categoryFilter}
            onChange={(v: string) => setCategoryFilter(v)}
            placeholder="Filter by category"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-left text-gray-600">
                  <Th>ID</Th>
                  <Th>Date</Th>
                  <Th>Sender</Th>
                  <Th>Receiver</Th>
                  <Th>Category</Th>
                  <Th>Payment</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Amount</Th>
                  <Th className="text-right pr-6">Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((transaction, i) => (
                  <tr
                    key={transaction.id}
                    className={`hover:bg-gray-50/70 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <Td mono>{transaction.id}</Td>
                    <Td className="text-gray-600">{transaction.date}</Td>
                    <Td>{transaction.sender}</Td>
                    <Td>{transaction.receiver}</Td>
                    <Td className="text-gray-600">{transaction.category}</Td>
                    <Td className="text-gray-600">
                      {transaction.paymentMethod}
                    </Td>
                    <Td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.replace("_", " ")}
                      </span>
                    </Td>
                    <Td className="text-right font-semibold text-[#2B0850]">
                      ${transaction.amount.toLocaleString()}
                    </Td>
                    <Td className="text-right">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#2B0850] text-white hover:bg-[#3c1070] transition-colors">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </Td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-600">
                        <FileText className="w-12 h-12 text-gray-300 mb-2" />
                        <div className="font-medium">No Transactions Found</div>
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

/* ---------- Helper Components ---------- */

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
  mono = false,
}: {
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 align-middle ${
        mono ? "font-mono text-xs" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
