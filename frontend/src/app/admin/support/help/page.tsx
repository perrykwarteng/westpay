"use client";

import { useState, useMemo, ChangeEvent } from "react";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle,
  Mail,
  Eye,
} from "lucide-react";
import { Input } from "@/component/Input-icon/Input";
import SelectSearch from "@/component/select/SelectSearch";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "high" | "medium" | "low";

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    userId: "USR-001",
    userName: "John Doe",
    userEmail: "john@example.com",
    subject: "Payment not received",
    description: "Transaction completed but funds not in my account",
    category: "Payment",
    status: "open",
    priority: "high",
    createdAt: "2025-10-24",
    updatedAt: "2025-10-24",
  },
  {
    id: "TKT-002",
    userId: "USR-002",
    userName: "Sarah Smith",
    userEmail: "sarah@example.com",
    subject: "How to verify my account?",
    description: "Need help with account verification process",
    category: "Account",
    status: "in_progress",
    priority: "medium",
    createdAt: "2025-10-23",
    updatedAt: "2025-10-24",
    assignedTo: "Admin Sarah",
  },
  {
    id: "TKT-003",
    userId: "USR-003",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    subject: "Transaction dispute",
    description: "Seller not responding to messages",
    category: "Dispute",
    status: "resolved",
    priority: "high",
    createdAt: "2025-10-22",
    updatedAt: "2025-10-23",
    assignedTo: "Admin John",
  },
];

const mockFAQs: FAQ[] = [
  {
    id: "FAQ-001",
    question: "How does escrow work?",
    answer:
      "Escrow is a secure payment method where funds are held by a trusted third party until both buyer and seller fulfill their obligations.",
    category: "General",
    order: 1,
    active: true,
  },
  {
    id: "FAQ-002",
    question: "What are the fees?",
    answer:
      "We charge a 2.5% service fee on each transaction, with a minimum fee of $5.",
    category: "Pricing",
    order: 2,
    active: true,
  },
  {
    id: "FAQ-003",
    question: "How long does verification take?",
    answer:
      "Account verification typically takes 1-2 business days once all required documents are submitted.",
    category: "Account",
    order: 3,
    active: true,
  },
  {
    id: "FAQ-004",
    question: "Can I cancel a transaction?",
    answer:
      "Transactions can be cancelled if both parties agree or if the terms specified in the agreement allow for cancellation.",
    category: "Transactions",
    order: 4,
    active: true,
  },
];

export default function SupportAndFAQ() {
  const [activeTab, setActiveTab] = useState<"tickets" | "faqs">("tickets");
  const [tickets, ] = useState<SupportTicket[]>(mockTickets);
  const [faqs, setFAQs] = useState<FAQ[]>(mockFAQs);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
    category: "General",
  });

  const filteredTickets = useMemo(() => {
    const res = tickets.filter((ticket) => {
      const matchesSearch =
        q === "" ||
        ticket.subject.toLowerCase().includes(q.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(q.toLowerCase()) ||
        ticket.id.toLowerCase().includes(q.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setPage(1);
    return res;
  }, [tickets, q, statusFilter]);

  const filteredFAQs = useMemo(() => {
    return faqs.filter(
      (faq) =>
        q === "" ||
        faq.question.toLowerCase().includes(q.toLowerCase()) ||
        faq.answer.toLowerCase().includes(q.toLowerCase())
    );
  }, [faqs, q]);

  const total =
    activeTab === "tickets" ? filteredTickets.length : filteredFAQs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginatedTickets = filteredTickets.slice(startIdx, endIdx);
  const paginatedFAQs = filteredFAQs.slice(startIdx, endIdx);

  const getStatusColor = (status: TicketStatus) => {
    return status === "open"
      ? "bg-red-100 text-red-700"
      : status === "in_progress"
      ? "bg-amber-100 text-amber-700"
      : status === "resolved"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: TicketPriority) => {
    return priority === "high"
      ? "bg-red-100 text-red-700"
      : priority === "medium"
      ? "bg-amber-100 text-amber-700"
      : "bg-blue-100 text-blue-700";
  };

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const faq: FAQ = {
        id: `FAQ-${String(faqs.length + 1).padStart(3, "0")}`,
        ...newFAQ,
        order: faqs.length + 1,
        active: true,
      };
      setFAQs([...faqs, faq]);
      setNewFAQ({ question: "", answer: "", category: "General" });
      setShowAddFAQ(false);
    }
  };

  const handleDeleteFAQ = (id: string) => {
    setFAQs(faqs.filter((faq) => faq.id !== id));
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2B0850]">
              Support & FAQ Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage support tickets and frequently asked questions
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Total Tickets</p>
            <p className="text-2xl font-bold text-[#2B0850]">
              {ticketStats.total}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Open</p>
            <p className="text-2xl font-bold text-red-600">
              {ticketStats.open}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-amber-600">
              {ticketStats.inProgress}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {ticketStats.resolved}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl shadow border border-gray-100 p-2">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              activeTab === "tickets"
                ? "bg-[#2B0850] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Support Tickets
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              activeTab === "faqs"
                ? "bg-[#2B0850] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Filters */}
        {activeTab === "tickets" ? (
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={q}
              icon="search"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQ(e.target.value)
              }
              placeholder="Search tickets…"
              className="w-full outline-none text-sm"
            />

            <SelectSearch
              options={[
                { label: "All Statuses", value: "all" },
                { label: "Open", value: "open" },
                { label: "In Progress", value: "in_progress" },
                { label: "Resolved", value: "resolved" },
                { label: "Closed", value: "closed" },
              ]}
              value={statusFilter}
              onChange={(v: string) => setStatusFilter(v)}
              placeholder="Filter by status"
            />

            <div className="hidden md:block" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={q}
              icon="search"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQ(e.target.value)
              }
              placeholder="Search FAQs…"
              className="w-full outline-none text-sm"
            />

            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={() => setShowAddFAQ(!showAddFAQ)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B0850] text-white rounded-md hover:bg-[#3c1070] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add New FAQ
              </button>
            </div>
          </div>
        )}

        {/* Add FAQ Form */}
        {activeTab === "faqs" && showAddFAQ && (
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#2B0850] mb-4">
              Add New FAQ
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newFAQ.category}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setNewFAQ({ ...newFAQ, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] focus:border-[#2B0850] outline-none"
                >
                  <option value="General">General</option>
                  <option value="Account">Account</option>
                  <option value="Transactions">Transactions</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={newFAQ.question}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewFAQ({ ...newFAQ, question: e.target.value })
                  }
                  placeholder="Enter the question..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] focus:border-[#2B0850] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={newFAQ.answer}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setNewFAQ({ ...newFAQ, answer: e.target.value })
                  }
                  placeholder="Enter the answer..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] focus:border-[#2B0850] outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddFAQ}
                  className="flex-1 px-4 py-2 bg-[#2B0850] text-white rounded-lg hover:bg-[#3c1070] transition-colors"
                >
                  Add FAQ
                </button>
                <button
                  onClick={() => {
                    setShowAddFAQ(false);
                    setNewFAQ({
                      question: "",
                      answer: "",
                      category: "General",
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "tickets" ? (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-left text-gray-600">
                    <Th>Ticket ID</Th>
                    <Th>User</Th>
                    <Th>Subject</Th>
                    <Th>Category</Th>
                    <Th>Priority</Th>
                    <Th>Status</Th>
                    <Th>Created</Th>
                    <Th className="text-right pr-6">Action</Th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedTickets.map((ticket, i) => (
                    <tr
                      key={ticket.id}
                      className={`hover:bg-gray-50/70 transition ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <Td mono>{ticket.id}</Td>
                      <Td>
                        <div>
                          <p className="font-medium text-[#2B0850]">
                            {ticket.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ticket.userEmail}
                          </p>
                        </div>
                      </Td>
                      <Td className="max-w-xs truncate">{ticket.subject}</Td>
                      <Td className="text-gray-600">{ticket.category}</Td>
                      <Td>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority.toUpperCase()}
                        </span>
                      </Td>
                      <Td>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                      </Td>
                      <Td className="text-gray-600">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </Td>
                      <Td className="text-right">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#2B0850] text-white hover:bg-[#3c1070] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </Td>
                    </tr>
                  ))}

                  {paginatedTickets.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-10 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-600">
                          <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
                          <div className="font-medium">No Tickets Found</div>
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
        ) : (
          <div className="space-y-4">
            {paginatedFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#2B0850] mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-700">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Order: {faq.order}
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={faq.active}
                      onChange={() => {
                        setFAQs(
                          faqs.map((f) =>
                            f.id === faq.id ? { ...f, active: !f.active } : f
                          )
                        );
                      }}
                      className="w-4 h-4 text-[#2B0850] rounded focus:ring-2 focus:ring-[#2B0850]"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            ))}

            {paginatedFAQs.length === 0 && (
              <div className="bg-white rounded-xl shadow border border-gray-100 p-10 text-center">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No FAQs found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or add a new FAQ
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#2B0850] mb-2">
                      {selectedTicket.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedTicket.subject}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">User</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTicket.userName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedTicket.userEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-sm text-gray-900">
                      {selectedTicket.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-[#2B0850] text-white rounded-md hover:bg-[#3c1070] transition-colors text-sm flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Reply to User
                  </button>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    In Progress
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 col-span-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
