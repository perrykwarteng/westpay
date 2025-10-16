"use client";

import Link from "next/link";
import { useMemo, useState, ChangeEvent } from "react";
import { FileText, ArrowRight } from "lucide-react";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import { mockTransactions } from "@/data/mockTransactions";

import { Input } from "@/component/Input-icon/Input";
import SelectSearch from "@/component/select/SelectSearch";

type Status = "pending" | "accepted" | "declined";

interface Transaction {
  transactionId: string;
  senderName: string;
  senderAccountId: string;
  receiverAccountId: string;
  paymentTerm: string;
  serviceArea: string;
  amount: number;
  createdAt?: string;
  status?: Status;
}

export default function TransactionsPage() {
  const all: Transaction[] = mockTransactions as Transaction[];

  const [q, setQ] = useState<string>("");
  const [service, setService] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const rows = useMemo(() => {
    const withHistory = all.map((t, i) => {
      const createdAt =
        t.createdAt ??
        new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();

      const status: Status =
        t.status ??
        (i % 3 === 0 ? "accepted" : i % 3 === 1 ? "pending" : "declined");

      return { ...t, createdAt, status };
    });

    return withHistory.sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }, [all]);

  const services = useMemo(() => {
    const set = new Set<string>(rows.map((t) => t.serviceArea));
    return ["all", ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    const res = rows.filter((t) => {
      const matchesQ =
        q.trim() === "" ||
        [
          t.transactionId,
          t.senderName,
          t.senderAccountId,
          t.receiverAccountId,
          t.paymentTerm,
          t.serviceArea,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase());

      const matchesService = service === "all" || t.serviceArea === service;
      return matchesQ && matchesService;
    });

    setPage(1);
    return res;
  }, [rows, q, service]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filtered.slice(startIdx, endIdx);

  // ✅ UI Rendering
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2B0850]">Transactions</h1>
            <p className="text-sm text-gray-600 mt-1">
              View and filter all your escrow transactions
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={q}
            icon="search"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQ(e.target.value)
            }
            placeholder="Search ID, name, account, term…"
            className="w-full outline-none text-sm"
          />

          <SelectSearch
            options={services.map((s) => ({
              label: s === "all" ? "All Services" : s,
              value: s,
            }))}
            value={service}
            onChange={(v: string) => setService(v)}
            placeholder="Filter by service"
          />

          <div className="hidden md:block" />
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-left text-gray-600">
                  <Th>ID</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Sender</Th>
                  <Th>Sender Acc.</Th>
                  <Th>Receiver Acc.</Th>
                  <Th>Service</Th>
                  <Th className="text-right">Amount</Th>
                  <Th className="text-right pr-6">Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((t, i) => (
                  <tr
                    key={t.transactionId}
                    className={`hover:bg-gray-50/70 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <Td mono>{t.transactionId}</Td>
                    <Td className="text-gray-600">
                      {new Date(t.createdAt!).toLocaleDateString()}
                    </Td>
                    <Td>
                      <StatusBadge status={t.status!} />
                    </Td>
                    <Td>{t.senderName}</Td>
                    <Td mono className="text-gray-600">
                      {t.senderAccountId}
                    </Td>
                    <Td mono className="text-gray-600">
                      {t.receiverAccountId}
                    </Td>
                    <Td>{t.serviceArea}</Td>
                    <Td className="text-right font-semibold text-[#2B0850]">
                      ${t.amount.toLocaleString()}
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/user/transaction/${t.transactionId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#2B0850] text-white hover:bg-[#3c1070] focus:outline-none focus:ring-2 focus:ring-[#2B0850]/40"
                      >
                        View <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-10 text-center">
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

function StatusBadge({ status }: { status: Status }) {
  const styles =
    status === "accepted"
      ? "bg-green-100 text-green-700"
      : status === "pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
