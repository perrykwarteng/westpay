"use client";

import React, { useMemo, useState } from "react";
import PaymentForm from "@/component/Payment/PaymentForm";
import Modal from "@/component/Modal/Modal";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import {
  Plus,
  Pencil,
  Trash2,
  CreditCard,
  Building2,
  Smartphone,
} from "lucide-react";

type PaymentType = "card" | "bank" | "momo";

export interface PaymentPayload {
  method: PaymentType;
  bank: string | null;
  momoProvider: string | null;
  card: {
    cardNumber: string;
    cvv: string;
    expiry: string;
  } | null;
  accountNumber: string | null; // null for cards
  accountName: string | null; // null for cards
}

type PaymentMethod = PaymentPayload & { id: string };

export default function PaymentPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editData, setEditData] = useState<
    (Partial<PaymentPayload> & { id?: string }) | null
  >(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isEditing = !!editData?.id;

  const handleSave = (data: PaymentPayload) => {
    setMethods((prev) => {
      if (isEditing && editData?.id) {
        return prev.map((m) => (m.id === editData.id ? { ...m, ...data } : m));
      }
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now());
      return [...prev, { id, ...data }];
    });

    // close form
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      setMethods((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    }
    setIsDeleteOpen(false);
  };

  const prettyMethod = (m: PaymentType) =>
    m === "bank" ? "Bank" : m === "momo" ? "MoMo" : "Card";

  const providerFor = (pm: PaymentPayload) =>
    pm.method === "bank"
      ? pm.bank
      : pm.method === "momo"
      ? pm.momoProvider
      : "—";

  const iconFor = (m: PaymentType) =>
    m === "bank" ? (
      <Building2 className="h-4 w-4" />
    ) : m === "momo" ? (
      <Smartphone className="h-4 w-4" />
    ) : (
      <CreditCard className="h-4 w-4" />
    );

  const subtitle = useMemo(
    () => (isEditing ? "Edit payment method" : "Add a new payment method"),
    [isEditing]
  );

  const maskCard = (n?: string) =>
    n && n.length >= 4 ? `•••• •••• •••• ${n.slice(-4)}` : "—";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2B0850]">
              Payment Methods
            </h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-[#2B0850] px-4 py-2 text-white shadow-sm transition hover:opacity-95"
            onClick={() => {
              setEditData(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Method
          </button>
        </div>

        {/* Empty state */}
        {methods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#2B0850]/10 text-[#2B0850]">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-base font-medium text-gray-800">
              No payment methods yet
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Add a bank account, MoMo wallet, or card to get started.
            </p>
          </div>
        ) : (
          // Grid list
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {methods.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* Badge */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    {iconFor(m.method)}
                    {prettyMethod(m.method)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {providerFor(m) ?? "—"}
                  </span>
                </div>

                {/* Core info */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      {m.method === "momo"
                        ? "MoMo Number"
                        : m.method === "bank"
                        ? "Account Number"
                        : "Card"}
                    </span>
                    <span className="font-medium text-gray-900">
                      {m.method === "card"
                        ? maskCard(m.card?.cardNumber)
                        : m.accountNumber || "—"}
                    </span>
                  </div>
                  {m.method !== "card" && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Account Name</span>
                      <span className="font-medium text-gray-900">
                        {m.accountName || "—"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      const { id, ...rest } = m;
                      setEditData({ id, ...rest });
                      setIsFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(m.id);
                      setIsDeleteOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <PaymentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditData(null);
          }}
          onSave={handleSave}
          initialData={editData || undefined}
        />

        <Modal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Delete payment method?"
          footer={
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:opacity-95"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          }
        >
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
